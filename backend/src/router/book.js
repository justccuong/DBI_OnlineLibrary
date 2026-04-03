const express = require("express")

const { sql, pool, hasDbConnection } = require("../configs/db")
const mockLibrary = require("../data/mockLibrary")
const { authMiddleware, admin } = require("../middleware/auth")

const bookRouter = express.Router()

bookRouter.get("/stats", async (req, res) => {
    try {
        if (!hasDbConnection()) {
            return res.status(200).json(mockLibrary.getStats())
        }

        const result = await pool().request().query(`
            SELECT
                (SELECT COUNT(*) FROM Book) AS totalBooks,
                (SELECT COUNT(*) FROM Category) AS totalCategories,
                (SELECT COUNT(*) FROM [User]) AS totalMembers,
                (SELECT COUNT(*) FROM Access_log WHERE access_type = 'borrow') AS totalBorrows
        `)

        res.status(200).json(result.recordset[0])
    } catch (error) {
        res.status(500).json({ message: "Failed to load library stats" })
    }
})

bookRouter.get("/categories", async (req, res) => {
    try {
        if (!hasDbConnection()) {
            return res.status(200).json(mockLibrary.getCategories())
        }

        const result = await pool().request().query(`
            SELECT
                c.category_id AS Id,
                c.category_name AS Name,
                COUNT(bc.book_id) AS bookCount
            FROM Category c
            LEFT JOIN Book_Category bc ON c.category_id = bc.category_id
            GROUP BY c.category_id, c.category_name
            ORDER BY c.category_name ASC
        `)

        res.status(200).json(result.recordset)
    } catch (error) {
        res.status(500).json({ message: "Failed to load categories" })
    }
})

bookRouter.get("/my-books", authMiddleware, async (req, res) => {
    try {
        if (!hasDbConnection()) {
            return res.status(200).json(mockLibrary.getUserBooks(req.user.userId))
        }

        const result = await pool().request()
            .input("userId", sql.Int, req.user.userId)
            .query(`
                SELECT
                    b.book_id AS Id,
                    b.title AS Title,
                    b.isbn AS ISBN,
                    b.description AS Description,
                    (
                        SELECT TOP 1 c.category_name
                        FROM Book_Category bc
                        JOIN Category c ON c.category_id = bc.category_id
                        WHERE bc.book_id = b.book_id
                        ORDER BY c.category_name ASC
                    ) AS Category,
                    a.access_type AS AccessType,
                    MAX(a.Accessed_at) AS AccessedAt
                FROM Access_log a
                JOIN Book b ON a.book_id = b.book_id
                WHERE a.user_id = @userId
                GROUP BY b.book_id, b.title, b.isbn, b.description, a.access_type
                ORDER BY MAX(a.Accessed_at) DESC, b.title ASC
            `)

        res.status(200).json(result.recordset)
    } catch (error) {
        res.status(500).json({ message: "Failed to load borrowed books" })
    }
})

bookRouter.get("/:id", async (req, res) => {
    try {
        const bookId = Number(req.params.id)

        if (Number.isNaN(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        if (!hasDbConnection()) {
            const book = mockLibrary.getBookById(bookId)

            if (!book) {
                return res.status(404).json({ message: "Book not found" })
            }

            return res.status(200).json(book)
        }

        const bookResult = await pool().request()
            .input("id", sql.Int, bookId)
            .query(`
                SELECT
                    b.book_id AS Id,
                    b.title AS Title,
                    b.isbn AS ISBN,
                    b.description AS Description,
                    b.Publisher_name AS PublisherName,
                    b.Published_year AS PublishedYear,
                    b.total_page AS TotalPage,
                    b.file_format AS FileFormat,
                    b.file_size AS FileSize,
                    b.file_url AS FileUrl,
                    b.preview_url AS PreviewUrl,
                    b.average_score AS AverageScore,
                    b.total_rate AS TotalRate,
                    b.total_download AS TotalDownload,
                    b.total_view AS TotalView,
                    b.downloadable AS Downloadable
                FROM Book b
                WHERE b.book_id = @id
            `)

        const book = bookResult.recordset[0]

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        const categoryResult = await pool().request()
            .input("id", sql.Int, bookId)
            .query(`
                SELECT
                    c.category_id AS Id,
                    c.category_name AS Name
                FROM Book_Category bc
                JOIN Category c ON c.category_id = bc.category_id
                WHERE bc.book_id = @id
                ORDER BY c.category_name ASC
            `)

        const authorResult = await pool().request()
            .input("id", sql.Int, bookId)
            .query(`
                SELECT
                    a.author_id AS Id,
                    a.author_name AS Name
                FROM Book_Author ba
                JOIN Author a ON a.author_id = ba.author_id
                WHERE ba.book_id = @id
                ORDER BY a.author_name ASC
            `)

        const borrowResult = await pool().request()
            .input("id", sql.Int, bookId)
            .query(`
                SELECT COUNT(*) AS borrowCount
                FROM Access_log
                WHERE book_id = @id AND access_type = 'borrow'
            `)

        res.status(200).json({
            ...book,
            categories: categoryResult.recordset,
            authors: authorResult.recordset,
            borrowCount: borrowResult.recordset[0]?.borrowCount || 0,
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to load book detail" })
    }
})

bookRouter.get("/", async (req, res) => {
    try {
        const search = String(req.query.search || "").trim()
        const category = String(req.query.category || "").trim()

        if (!hasDbConnection()) {
            return res.status(200).json(
                mockLibrary.getBooks({
                    search,
                    category,
                })
            )
        }

        const result = await pool().request()
            .input("search", sql.NVarChar, search)
            .input("category", sql.NVarChar, category)
            .query(`
                SELECT
                    b.book_id AS Id,
                    b.title AS Title,
                    b.isbn AS ISBN,
                    b.description AS Description,
                    (
                        SELECT TOP 1 c.category_name
                        FROM Book_Category bc
                        JOIN Category c ON c.category_id = bc.category_id
                        WHERE bc.book_id = b.book_id
                        ORDER BY c.category_name ASC
                    ) AS Category,
                    (
                        SELECT COUNT(*)
                        FROM Access_log a
                        WHERE a.book_id = b.book_id
                          AND a.access_type = 'borrow'
                    ) AS BorrowCount
                FROM Book b
                WHERE
                    (@search = '' OR b.title LIKE '%' + @search + '%' OR b.isbn LIKE '%' + @search + '%')
                    AND (
                        @category = ''
                        OR EXISTS (
                            SELECT 1
                            FROM Book_Category bc
                            JOIN Category c ON c.category_id = bc.category_id
                            WHERE bc.book_id = b.book_id
                              AND c.category_name = @category
                        )
                    )
                ORDER BY b.title ASC
            `)

        res.status(200).json(result.recordset)
    } catch (error) {
        res.status(500).json({ message: "Failed to load books" })
    }
})

bookRouter.post("/borrow", authMiddleware, async (req, res) => {
    try {
        const bookId = Number(req.body.bookId)

        if (Number.isNaN(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        if (!hasDbConnection()) {
            const book = mockLibrary.createBorrow({
                userId: req.user.userId,
                bookId,
            })

            if (!book) {
                return res.status(404).json({ message: "Book not found" })
            }

            return res.status(201).json({
                message: "Borrow success",
                book: {
                    Id: book.Id,
                    Title: book.Title,
                },
            })
        }

        const bookCheck = await pool().request()
            .input("bookId", sql.Int, bookId)
            .query(`
                SELECT
                    book_id AS Id,
                    title AS Title
                FROM Book
                WHERE book_id = @bookId
            `)

        const book = bookCheck.recordset[0]

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        await pool().request()
            .input("userId", sql.Int, req.user.userId)
            .input("bookId", sql.Int, bookId)
            .input("type", sql.NVarChar, "borrow")
            .input("deviceIp", sql.VarChar, req.ip || req.socket?.remoteAddress || "")
            .query(`
                INSERT INTO Access_log(user_id, book_id, access_type, device_ip)
                VALUES(@userId, @bookId, @type, @deviceIp)
            `)

        res.status(201).json({
            message: "Borrow success",
            book
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to borrow book" })
    }
})

bookRouter.post("/", authMiddleware, admin, async (req, res) => {
    let transaction

    try {
        const { title, isbn, description, categoryId } = req.body

        if (!title || !isbn) {
            return res.status(400).json({ message: "Title and ISBN are required" })
        }

        if (!hasDbConnection()) {
            const book = mockLibrary.createBook({
                title,
                isbn,
                description,
                categoryId,
            })

            return res.status(201).json({
                message: "Book added",
                book,
            })
        }

        transaction = new sql.Transaction(pool())

        await transaction.begin()

        const createdBookResult = await new sql.Request(transaction)
            .input("title", sql.NVarChar, title)
            .input("isbn", sql.NVarChar, isbn)
            .input("description", sql.NVarChar, description || "")
            .query(`
                INSERT INTO Book(title, isbn, description)
                OUTPUT INSERTED.book_id AS Id, INSERTED.title AS Title, INSERTED.isbn AS ISBN, INSERTED.description AS Description
                VALUES(@title, @isbn, @description)
            `)

        const book = createdBookResult.recordset[0]

        if (categoryId) {
            await new sql.Request(transaction)
                .input("bookId", sql.Int, book.Id)
                .input("categoryId", sql.Int, Number(categoryId))
                .query(`
                    INSERT INTO Book_Category(book_id, category_id)
                    VALUES(@bookId, @categoryId)
                `)
        }

        await transaction.commit()

        res.status(201).json({
            message: "Book added",
            book
        })
    } catch (error) {
        if (transaction && transaction._aborted !== true) {
            await transaction.rollback()
        }

        res.status(500).json({ message: "Failed to add book" })
    }
})

bookRouter.put("/:id", authMiddleware, admin, async (req, res) => {
    let transaction

    try {
        const bookId = Number(req.params.id)
        const { title, isbn, description, categoryId } = req.body

        if (Number.isNaN(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        if (!hasDbConnection()) {
            const book = mockLibrary.updateBook(bookId, {
                title,
                isbn,
                description,
                categoryId,
            })

            if (!book) {
                return res.status(404).json({ message: "Book not found" })
            }

            return res.status(200).json({ message: "Book updated", book })
        }

        transaction = new sql.Transaction(pool())

        await transaction.begin()

        const updateResult = await new sql.Request(transaction)
            .input("id", sql.Int, bookId)
            .input("title", sql.NVarChar, title)
            .input("isbn", sql.NVarChar, isbn)
            .input("description", sql.NVarChar, description || "")
            .query(`
                UPDATE Book
                SET title = @title,
                    isbn = @isbn,
                    description = @description
                WHERE book_id = @id
            `)

        if (!updateResult.rowsAffected[0]) {
            await transaction.rollback()
            return res.status(404).json({ message: "Book not found" })
        }

        await new sql.Request(transaction)
            .input("bookId", sql.Int, bookId)
            .query("DELETE FROM Book_Category WHERE book_id = @bookId")

        if (categoryId) {
            await new sql.Request(transaction)
                .input("bookId", sql.Int, bookId)
                .input("categoryId", sql.Int, Number(categoryId))
                .query(`
                    INSERT INTO Book_Category(book_id, category_id)
                    VALUES(@bookId, @categoryId)
                `)
        }

        await transaction.commit()

        res.status(200).json({ message: "Book updated" })
    } catch (error) {
        if (transaction && transaction._aborted !== true) {
            await transaction.rollback()
        }

        res.status(500).json({ message: "Failed to update book" })
    }
})

bookRouter.delete("/:id", authMiddleware, admin, async (req, res) => {
    let transaction

    try {
        const bookId = Number(req.params.id)

        if (Number.isNaN(bookId)) {
            return res.status(400).json({ message: "Invalid book id" })
        }

        if (!hasDbConnection()) {
            const deleted = mockLibrary.deleteBook(bookId)

            if (!deleted) {
                return res.status(404).json({ message: "Book not found" })
            }

            return res.status(200).json({ message: "Book deleted" })
        }

        transaction = new sql.Transaction(pool())

        await transaction.begin()

        const deleteResult = await new sql.Request(transaction)
            .input("bookId", sql.Int, bookId)
            .query("DELETE FROM Book WHERE book_id = @bookId")

        if (!deleteResult.rowsAffected[0]) {
            await transaction.rollback()
            return res.status(404).json({ message: "Book not found" })
        }

        await transaction.commit()

        res.status(200).json({ message: "Book deleted" })
    } catch (error) {
        if (transaction && transaction._aborted !== true) {
            await transaction.rollback()
        }

        res.status(500).json({ message: "Failed to delete book" })
    }
})

module.exports = bookRouter
