const users = [
    {
        Id: 1,
        UserName: "Admin Demo",
        Email: "admin@demo.local",
        Password: "Admin123",
        Role: "admin",
    },
    {
        Id: 2,
        UserName: "Student Demo",
        Email: "student@demo.local",
        Password: "Member123",
        Role: "member",
    },
]

const categories = [
    { Id: 1, Name: "Technology" },
    { Id: 2, Name: "Database" },
    { Id: 3, Name: "Business" },
    { Id: 4, Name: "Design" },
]

const books = [
    {
        Id: 1,
        Title: "SQL Server Fundamentals",
        ISBN: "978-100000001",
        Description: "A beginner-friendly guide to tables, joins, keys, and queries in Microsoft SQL Server.",
    },
    {
        Id: 2,
        Title: "Modern Web Interfaces",
        ISBN: "978-100000002",
        Description: "Practical UI patterns for responsive React applications and real project delivery.",
    },
    {
        Id: 3,
        Title: "Data Modeling for Campus Systems",
        ISBN: "978-100000003",
        Description: "A small-system database design book focused on users, books, categories, and borrowing flows.",
    },
    {
        Id: 4,
        Title: "Productive Team Projects",
        ISBN: "978-100000004",
        Description: "How to split responsibilities and still ship a clean application with confidence.",
    },
]

const bookCategory = [
    { IdBook: 1, IdCategory: 2 },
    { IdBook: 2, IdCategory: 1 },
    { IdBook: 3, IdCategory: 2 },
    { IdBook: 4, IdCategory: 3 },
]

const accessLogs = [
    { Id: 1, IdUser: 2, IdBook: 1, AccessType: "borrow", CreatedAt: "2026-03-23T08:00:00.000Z" },
    { Id: 2, IdUser: 2, IdBook: 2, AccessType: "borrow", CreatedAt: "2026-03-23T09:00:00.000Z" },
]

let nextUserId = 3
let nextBookId = 5
let nextLogId = 3

const normalizeText = (value) => String(value || "").trim().toLowerCase()

const getCategoryNameForBook = (bookId) => {
    const relation = bookCategory.find((item) => item.IdBook === bookId)
    const category = categories.find((item) => item.Id === relation?.IdCategory)
    return category?.Name || null
}

const getCategoriesForBook = (bookId) => {
    return bookCategory
        .filter((item) => item.IdBook === bookId)
        .map((item) => categories.find((category) => category.Id === item.IdCategory))
        .filter(Boolean)
}

const getBorrowCount = (bookId) => {
    return accessLogs.filter((item) => item.IdBook === bookId && item.AccessType === "borrow").length
}

const toBookSummary = (book) => ({
    Id: book.Id,
    Title: book.Title,
    ISBN: book.ISBN,
    Description: book.Description,
    Category: getCategoryNameForBook(book.Id),
    BorrowCount: getBorrowCount(book.Id),
})

const getStats = () => ({
    totalBooks: books.length,
    totalCategories: categories.length,
    totalMembers: users.length,
    totalBorrows: accessLogs.filter((item) => item.AccessType === "borrow").length,
})

const getCategories = () => {
    return categories
        .map((category) => ({
            Id: category.Id,
            Name: category.Name,
            bookCount: bookCategory.filter((item) => item.IdCategory === category.Id).length,
        }))
        .sort((left, right) => left.Name.localeCompare(right.Name))
}

const getBooks = ({ search = "", category = "" } = {}) => {
    const searchText = normalizeText(search)
    const categoryText = normalizeText(category)

    return books
        .map(toBookSummary)
        .filter((book) => {
            const matchesSearch =
                !searchText ||
                normalizeText(book.Title).includes(searchText) ||
                normalizeText(book.ISBN).includes(searchText)

            const matchesCategory = !categoryText || normalizeText(book.Category) === categoryText

            return matchesSearch && matchesCategory
        })
        .sort((left, right) => left.Title.localeCompare(right.Title))
}

const getBookById = (bookId) => {
    const book = books.find((item) => item.Id === Number(bookId))

    if (!book) {
        return null
    }

    return {
        Id: book.Id,
        Title: book.Title,
        ISBN: book.ISBN,
        Description: book.Description,
        categories: getCategoriesForBook(book.Id),
        borrowCount: getBorrowCount(book.Id),
    }
}

const getUserByEmail = (email) => {
    return users.find((item) => normalizeText(item.Email) === normalizeText(email)) || null
}

const getUserById = (userId) => {
    return users.find((item) => item.Id === Number(userId)) || null
}

const createUser = ({ userName, email, password, role = "member" }) => {
    const user = {
        Id: nextUserId++,
        UserName: userName,
        Email: email,
        Password: password,
        Role: role,
    }

    users.push(user)
    return user
}

const createBorrow = ({ userId, bookId }) => {
    const book = books.find((item) => item.Id === Number(bookId))

    if (!book) {
        return null
    }

    accessLogs.push({
        Id: nextLogId++,
        IdUser: Number(userId),
        IdBook: Number(bookId),
        AccessType: "borrow",
        CreatedAt: new Date().toISOString(),
    })

    return book
}

const getUserBooks = (userId) => {
    return accessLogs
        .filter((item) => item.IdUser === Number(userId))
        .map((item) => {
            const book = books.find((entry) => entry.Id === item.IdBook)

            if (!book) {
                return null
            }

            return {
                Id: book.Id,
                Title: book.Title,
                ISBN: book.ISBN,
                Description: book.Description,
                Category: getCategoryNameForBook(book.Id),
                AccessType: item.AccessType,
            }
        })
        .filter(Boolean)
        .sort((left, right) => left.Title.localeCompare(right.Title))
}

const createBook = ({ title, isbn, description = "", categoryId }) => {
    const book = {
        Id: nextBookId++,
        Title: title,
        ISBN: isbn,
        Description: description,
    }

    books.push(book)

    const normalizedCategoryId = Number(categoryId)
    if (normalizedCategoryId && categories.some((item) => item.Id === normalizedCategoryId)) {
        bookCategory.push({
            IdBook: book.Id,
            IdCategory: normalizedCategoryId,
        })
    }

    return toBookSummary(book)
}

const updateBook = (bookId, { title, isbn, description = "", categoryId }) => {
    const book = books.find((item) => item.Id === Number(bookId))

    if (!book) {
        return null
    }

    book.Title = title
    book.ISBN = isbn
    book.Description = description

    for (let index = bookCategory.length - 1; index >= 0; index -= 1) {
        if (bookCategory[index].IdBook === book.Id) {
            bookCategory.splice(index, 1)
        }
    }

    const normalizedCategoryId = Number(categoryId)
    if (normalizedCategoryId && categories.some((item) => item.Id === normalizedCategoryId)) {
        bookCategory.push({
            IdBook: book.Id,
            IdCategory: normalizedCategoryId,
        })
    }

    return toBookSummary(book)
}

const deleteBook = (bookId) => {
    const targetId = Number(bookId)
    const bookIndex = books.findIndex((item) => item.Id === targetId)

    if (bookIndex === -1) {
        return false
    }

    books.splice(bookIndex, 1)

    for (let index = bookCategory.length - 1; index >= 0; index -= 1) {
        if (bookCategory[index].IdBook === targetId) {
            bookCategory.splice(index, 1)
        }
    }

    for (let index = accessLogs.length - 1; index >= 0; index -= 1) {
        if (accessLogs[index].IdBook === targetId) {
            accessLogs.splice(index, 1)
        }
    }

    return true
}

module.exports = {
    createBook,
    createBorrow,
    createUser,
    deleteBook,
    getBookById,
    getBooks,
    getCategories,
    getStats,
    getUserBooks,
    getUserByEmail,
    getUserById,
    updateBook,
}
