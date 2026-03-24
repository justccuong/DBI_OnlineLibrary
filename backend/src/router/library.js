const express = require("express")

const { sql, pool, hasDbConnection } = require("../configs/db")
const { authMiddleware, admin } = require("../middleware/auth")
const { isAdminRole } = require("../utils/roles")

const libraryRouter = express.Router()

const readTypes = new Set(["view", "preview", "read"])

const requireSqlMode = (res) => {
    if (!hasDbConnection()) {
        res.status(503).json({ message: "Library SQL API is not available in mock mode" })
        return false
    }

    return true
}

const createRequest = (transaction) => (transaction ? new sql.Request(transaction) : pool().request())

const runQuery = async (queryText, inputs = [], transaction = null) => {
    const request = createRequest(transaction)

    inputs.forEach(({ name, type, value }) => {
        request.input(name, type, value)
    })

    const result = await request.query(queryText)
    return result.recordset
}

const toNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
        return null
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}

const normalizeIdList = (values) => {
    if (!Array.isArray(values)) {
        return []
    }

    return [...new Set(values.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0))]
}

const groupRowsByBook = (rows, mapper) => {
    const grouped = new Map()

    rows.forEach((row) => {
        if (!grouped.has(row.book_id)) {
            grouped.set(row.book_id, [])
        }

        grouped.get(row.book_id).push(mapper(row))
    })

    return grouped
}

const attachRelations = (books, authorRows, categoryRows, reviewRows = []) => {
    const authorsByBook = groupRowsByBook(authorRows, (row) => ({
        author_id: row.author_id,
        author_name: row.author_name,
        bio: row.bio,
    }))

    const categoriesByBook = groupRowsByBook(categoryRows, (row) => ({
        category_id: row.category_id,
        category_name: row.category_name,
    }))

    const reviewsByBook = groupRowsByBook(reviewRows, (row) => ({
        user_id: row.user_id,
        book_id: row.book_id,
        Rating_score: row.Rating_score,
        Review_text: row.Review_text,
        Created_at: row.Created_at,
        user_name: row.user_name,
    }))

    return books.map((book) => ({
        ...book,
        authors: authorsByBook.get(book.book_id) || [],
        categories: categoriesByBook.get(book.book_id) || [],
        reviews: reviewsByBook.get(book.book_id) || [],
    }))
}

const fetchAuthorOptions = async (transaction = null) =>
    runQuery(
        `
            SELECT
                a.author_id,
                a.author_name,
                a.bio,
                COUNT(ba.book_id) AS book_count
            FROM Author a
            LEFT JOIN Book_Author ba ON ba.author_id = a.author_id
            GROUP BY a.author_id, a.author_name, a.bio
            ORDER BY a.author_name ASC
        `,
        [],
        transaction,
    )

const fetchCategoryOptions = async (transaction = null) =>
    runQuery(
        `
            SELECT
                c.category_id,
                c.category_name,
                COUNT(bc.book_id) AS book_count
            FROM Category c
            LEFT JOIN Book_Category bc ON bc.category_id = c.category_id
            GROUP BY c.category_id, c.category_name
            ORDER BY c.category_name ASC
        `,
        [],
        transaction,
    )

const fetchRoles = async (transaction = null) =>
    runQuery(
        `
            SELECT role_id, role_name, max_download_per_day
            FROM [Role]
            ORDER BY role_id ASC
        `,
        [],
        transaction,
    )

const fetchBooks = async ({ bookId = null, includeReviews = false, transaction = null } = {}) => {
    const inputs = []
    const bookWhere = bookId ? "WHERE b.book_id = @bookId" : ""
    const relationWhere = bookId ? "WHERE source.book_id = @bookId" : ""

    if (bookId) {
        inputs.push({ name: "bookId", type: sql.Int, value: bookId })
    }

    const books = await runQuery(
        `
            SELECT
                b.book_id,
                b.title,
                b.Publisher_name,
                b.Published_year,
                b.total_page,
                b.file_format,
                CAST(b.average_score AS DECIMAL(3, 2)) AS average_score,
                b.isbn,
                b.total_rate,
                b.downloadable,
                b.total_download,
                b.total_view,
                b.description,
                b.file_size,
                b.file_url,
                b.preview_url
            FROM Book b
            ${bookWhere}
            ORDER BY b.title ASC
        `,
        inputs,
        transaction,
    )

    if (!books.length) {
        return []
    }

    const authorRows = await runQuery(
        `
            SELECT
                source.book_id,
                a.author_id,
                a.author_name,
                a.bio
            FROM Book_Author source
            JOIN Author a ON a.author_id = source.author_id
            ${relationWhere}
            ORDER BY a.author_name ASC
        `,
        inputs,
        transaction,
    )

    const categoryRows = await runQuery(
        `
            SELECT
                source.book_id,
                c.category_id,
                c.category_name
            FROM Book_Category source
            JOIN Category c ON c.category_id = source.category_id
            ${relationWhere}
            ORDER BY c.category_name ASC
        `,
        inputs,
        transaction,
    )

    const reviewRows = includeReviews
        ? await runQuery(
            `
                SELECT
                    source.book_id,
                    source.user_id,
                    source.Rating_score,
                    source.Review_text,
                    source.Created_at AS Created_at,
                    COALESCE(NULLIF([user].fullname, N''), [user].user_name, N'Anonymous Reader') AS user_name
                FROM Rate source
                JOIN [User] [user] ON [user].user_id = source.user_id
                ${relationWhere}
                ORDER BY source.Created_at DESC
            `,
            inputs,
            transaction,
        )
        : []

    return attachRelations(books, authorRows, categoryRows, reviewRows)
}

const buildDashboardPayload = async ({ search = "", categoryId = "", authorId = "" } = {}) => {
    const [books, authors, categories] = await Promise.all([
        fetchBooks(),
        fetchAuthorOptions(),
        fetchCategoryOptions(),
    ])

    const searchValue = String(search || "").trim().toLowerCase()
    const normalizedCategoryId = Number(categoryId) || null
    const normalizedAuthorId = Number(authorId) || null

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            !searchValue ||
            String(book.title || "").toLowerCase().includes(searchValue) ||
            String(book.isbn || "").toLowerCase().includes(searchValue)

        const matchesCategory =
            !normalizedCategoryId ||
            book.categories.some((category) => category.category_id === normalizedCategoryId)

        const matchesAuthor =
            !normalizedAuthorId ||
            book.authors.some((author) => author.author_id === normalizedAuthorId)

        return matchesSearch && matchesCategory && matchesAuthor
    })

    return {
        summary: {
            total_books: books.length,
            total_authors: authors.length,
            total_categories: categories.length,
            total_downloads: books.reduce((total, book) => total + Number(book.total_download || 0), 0),
        },
        filters: {
            categories,
            authors,
        },
        books: filteredBooks,
    }
}

const buildProfilePayload = async (userId) => {
    const userRows = await runQuery(
        `
            SELECT
                u.user_id,
                u.user_code,
                u.user_name,
                u.fullname,
                u.email,
                u.phone_number,
                r.role_id,
                r.role_name,
                r.max_download_per_day
            FROM [User] u
            JOIN [Role] r ON r.role_id = u.role_id
            WHERE u.user_id = @userId
        `,
        [{ name: "userId", type: sql.Int, value: userId }],
    )

    const user = userRows[0]

    if (!user) {
        return null
    }

    const history = await runQuery(
        `
            SELECT
                access_log.log_id,
                access_log.access_type,
                access_log.device_ip,
                access_log.Accessed_at,
                book.title,
                book.isbn
            FROM Access_log access_log
            JOIN Book book ON book.book_id = access_log.book_id
            WHERE access_log.user_id = @userId
            ORDER BY access_log.Accessed_at DESC
        `,
        [{ name: "userId", type: sql.Int, value: userId }],
    )

    return {
        user,
        summary: {
            total_logs: history.length,
            total_downloads: history.filter((item) => item.access_type === "download").length,
            total_reads: history.filter((item) => readTypes.has(String(item.access_type || "").toLowerCase())).length,
        },
        history,
    }
}

const parseBookPayload = (body = {}) => ({
    title: String(body.title || "").trim(),
    Publisher_name: String(body.Publisher_name || "").trim() || null,
    Published_year: toNumber(body.Published_year),
    total_page: toNumber(body.total_page),
    file_format: String(body.file_format || "PDF").trim() || "PDF",
    isbn: String(body.isbn || "").trim(),
    downloadable: body.downloadable ? 1 : 0,
    file_size: String(body.file_size || "").trim() || null,
    file_url: String(body.file_url || "").trim() || null,
    preview_url: String(body.preview_url || "").trim() || null,
    description: String(body.description || "").trim() || null,
    author_ids: normalizeIdList(body.author_ids),
    category_ids: normalizeIdList(body.category_ids),
})

const saveBookRecord = async (payload, bookId = null) => {
    const transaction = new sql.Transaction(pool())
    await transaction.begin()

    try {
        let targetBookId = bookId

        if (targetBookId) {
            const updateRequest = new sql.Request(transaction)

            updateRequest.input("bookId", sql.Int, targetBookId)
            updateRequest.input("title", sql.NVarChar, payload.title)
            updateRequest.input("Publisher_name", sql.NVarChar, payload.Publisher_name)
            updateRequest.input("Published_year", sql.Int, payload.Published_year)
            updateRequest.input("total_page", sql.Int, payload.total_page)
            updateRequest.input("file_format", sql.VarChar, payload.file_format)
            updateRequest.input("isbn", sql.VarChar, payload.isbn)
            updateRequest.input("downloadable", sql.Bit, payload.downloadable)
            updateRequest.input("file_size", sql.VarChar, payload.file_size)
            updateRequest.input("file_url", sql.NVarChar, payload.file_url)
            updateRequest.input("preview_url", sql.NVarChar, payload.preview_url)
            updateRequest.input("description", sql.NVarChar, payload.description)

            const updateResult = await updateRequest.query(`
                UPDATE Book
                SET
                    title = @title,
                    Publisher_name = @Publisher_name,
                    Published_year = @Published_year,
                    total_page = @total_page,
                    file_format = @file_format,
                    isbn = @isbn,
                    downloadable = @downloadable,
                    file_size = @file_size,
                    file_url = @file_url,
                    preview_url = @preview_url,
                    description = @description
                WHERE book_id = @bookId
            `)

            if (!updateResult.rowsAffected[0]) {
                const error = new Error("Book not found")
                error.statusCode = 404
                throw error
            }
        } else {
            const insertRequest = new sql.Request(transaction)

            insertRequest.input("title", sql.NVarChar, payload.title)
            insertRequest.input("Publisher_name", sql.NVarChar, payload.Publisher_name)
            insertRequest.input("Published_year", sql.Int, payload.Published_year)
            insertRequest.input("total_page", sql.Int, payload.total_page)
            insertRequest.input("file_format", sql.VarChar, payload.file_format)
            insertRequest.input("isbn", sql.VarChar, payload.isbn)
            insertRequest.input("downloadable", sql.Bit, payload.downloadable)
            insertRequest.input("file_size", sql.VarChar, payload.file_size)
            insertRequest.input("file_url", sql.NVarChar, payload.file_url)
            insertRequest.input("preview_url", sql.NVarChar, payload.preview_url)
            insertRequest.input("description", sql.NVarChar, payload.description)

            const inserted = await insertRequest.query(`
                INSERT INTO Book (
                    title,
                    Publisher_name,
                    Published_year,
                    total_page,
                    file_format,
                    isbn,
                    downloadable,
                    file_size,
                    file_url,
                    preview_url,
                    description
                )
                OUTPUT INSERTED.book_id AS book_id
                VALUES (
                    @title,
                    @Publisher_name,
                    @Published_year,
                    @total_page,
                    @file_format,
                    @isbn,
                    @downloadable,
                    @file_size,
                    @file_url,
                    @preview_url,
                    @description
                )
            `)

            targetBookId = inserted.recordset[0]?.book_id
        }

        const relationDeleteRequest = new sql.Request(transaction)
        relationDeleteRequest.input("bookId", sql.Int, targetBookId)
        await relationDeleteRequest.query(`
            DELETE FROM Book_Author WHERE book_id = @bookId;
            DELETE FROM Book_Category WHERE book_id = @bookId;
        `)

        for (const authorId of payload.author_ids) {
            const relationRequest = new sql.Request(transaction)
            relationRequest.input("bookId", sql.Int, targetBookId)
            relationRequest.input("authorId", sql.Int, authorId)
            await relationRequest.query(`
                INSERT INTO Book_Author (book_id, author_id)
                VALUES (@bookId, @authorId)
            `)
        }

        for (const categoryId of payload.category_ids) {
            const relationRequest = new sql.Request(transaction)
            relationRequest.input("bookId", sql.Int, targetBookId)
            relationRequest.input("categoryId", sql.Int, categoryId)
            await relationRequest.query(`
                INSERT INTO Book_Category (book_id, category_id)
                VALUES (@bookId, @categoryId)
            `)
        }

        await transaction.commit()
        return targetBookId
    } catch (error) {
        if (transaction._aborted !== true) {
            await transaction.rollback()
        }

        throw error
    }
}

libraryRouter.get("/dashboard", async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const payload = await buildDashboardPayload(req.query)
        res.status(200).json(payload)
    } catch (error) {
        res.status(500).json({ message: "Failed to load dashboard data" })
    }
})

libraryRouter.get("/profile/:userId", authMiddleware, async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const userId = Number(req.params.userId)

        if (!Number.isInteger(userId)) {
            return res.status(400).json({ message: "Invalid user id" })
        }

        if (req.user.userId !== userId && !isAdminRole(req.user.role)) {
            return res.status(403).json({ message: "You can only view your own profile" })
        }

        const payload = await buildProfilePayload(userId)

        if (!payload) {
            return res.status(404).json({ message: "Profile not found" })
        }

        res.status(200).json(payload)
    } catch (error) {
        res.status(500).json({ message: "Failed to load profile" })
    }
})

libraryRouter.get("/master-data", authMiddleware, admin, async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const [books, authors, categories, roles] = await Promise.all([
            fetchBooks(),
            fetchAuthorOptions(),
            fetchCategoryOptions(),
            fetchRoles(),
        ])

        res.status(200).json({
            books,
            authors,
            categories,
            roles,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to load master data" })
    }
})

libraryRouter.get("/books/:id", async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const bookId = Number(req.params.id)

        if (!Number.isInteger(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        const books = await fetchBooks({ bookId, includeReviews: true })
        const book = books[0]

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ message: "Failed to load book detail" })
    }
})

libraryRouter.post("/books/:id/reviews", authMiddleware, async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const bookId = Number(req.params.id)
        const ratingScore = Number(req.body.Rating_score)
        const reviewText = String(req.body.Review_text || "").trim()

        if (!Number.isInteger(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        if (!Number.isInteger(ratingScore) || ratingScore < 1 || ratingScore > 5) {
            return res.status(400).json({ message: "Rating_score must be between 1 and 5" })
        }

        const transaction = new sql.Transaction(pool())
        await transaction.begin()

        try {
            const reviewRequest = new sql.Request(transaction)
            reviewRequest.input("bookId", sql.Int, bookId)
            reviewRequest.input("userId", sql.Int, req.user.userId)
            reviewRequest.input("ratingScore", sql.Int, ratingScore)
            reviewRequest.input("reviewText", sql.NVarChar, reviewText)

            await reviewRequest.query(`
                IF EXISTS (
                    SELECT 1
                    FROM Rate
                    WHERE user_id = @userId AND book_id = @bookId
                )
                BEGIN
                    UPDATE Rate
                    SET
                        Rating_score = @ratingScore,
                        Review_text = @reviewText,
                        Created_at = GETDATE()
                    WHERE user_id = @userId AND book_id = @bookId
                END
                ELSE
                BEGIN
                    INSERT INTO Rate (user_id, book_id, Rating_score, Review_text)
                    VALUES (@userId, @bookId, @ratingScore, @reviewText)
                END
            `)

            const metricsRequest = new sql.Request(transaction)
            metricsRequest.input("bookId", sql.Int, bookId)
            await metricsRequest.query(`
                UPDATE Book
                SET
                    average_score = ISNULL((
                        SELECT CAST(AVG(CAST(Rating_score AS DECIMAL(5, 2))) AS DECIMAL(3, 2))
                        FROM Rate
                        WHERE book_id = @bookId
                    ), 0),
                    total_rate = (
                        SELECT COUNT(*)
                        FROM Rate
                        WHERE book_id = @bookId
                    )
                WHERE book_id = @bookId
            `)

            await transaction.commit()
        } catch (error) {
            if (transaction._aborted !== true) {
                await transaction.rollback()
            }

            throw error
        }

        const books = await fetchBooks({ bookId, includeReviews: true })
        res.status(200).json(books[0])
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Failed to submit review" })
    }
})

libraryRouter.post("/books", authMiddleware, admin, async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const payload = parseBookPayload(req.body)

        if (!payload.title || !payload.isbn) {
            return res.status(400).json({ message: "Title and ISBN are required" })
        }

        const bookId = await saveBookRecord(payload)
        const books = await fetchBooks({ bookId })

        res.status(201).json({
            message: "Book created",
            book: books[0],
        })
    } catch (error) {
        const statusCode = error.number === 2627 ? 409 : error.statusCode || 500
        res.status(statusCode).json({
            message: statusCode === 409 ? "ISBN already exists" : (error.message || "Failed to create book"),
        })
    }
})

libraryRouter.put("/books/:id", authMiddleware, admin, async (req, res) => {
    try {
        if (!requireSqlMode(res)) {
            return
        }

        const bookId = Number(req.params.id)

        if (!Number.isInteger(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        const payload = parseBookPayload(req.body)

        if (!payload.title || !payload.isbn) {
            return res.status(400).json({ message: "Title and ISBN are required" })
        }

        const savedBookId = await saveBookRecord(payload, bookId)
        const books = await fetchBooks({ bookId: savedBookId })

        res.status(200).json({
            message: "Book updated",
            book: books[0],
        })
    } catch (error) {
        const statusCode = error.number === 2627 ? 409 : error.statusCode || 500
        res.status(statusCode).json({
            message: statusCode === 409 ? "ISBN already exists" : (error.message || "Failed to update book"),
        })
    }
})

module.exports = libraryRouter
