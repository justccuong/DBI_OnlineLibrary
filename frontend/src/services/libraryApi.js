import { createMockState } from "../data/mockLibraryData"

const TOKEN_KEY = "online-library-token"
const REMOTE_LIBRARY_API = import.meta.env.VITE_ENABLE_LIBRARY_API !== "false"
const API_ROOT = import.meta.env.VITE_LIBRARY_API_BASE_URL || "/api/library"
const state = createMockState()

const wait = (time = 280) => new Promise((resolve) => setTimeout(resolve, time))

const buildUrl = (path) => `${API_ROOT}${path}`

async function fetchJson(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)

  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Library API request failed: ${response.status}`)
  }

  return response.json()
}

async function withFallback(remoteWork, fallbackWork) {
  if (!REMOTE_LIBRARY_API) {
    await wait()
    return fallbackWork()
  }

  try {
    return await remoteWork()
  } catch {
    await wait()
    return fallbackWork()
  }
}

function roleNameFromId(roleId) {
  return state.roles.find((role) => role.role_id === roleId)?.role_name || "member"
}

function authorIdsForBook(bookId) {
  return state.bookAuthors.filter((item) => item.book_id === bookId).map((item) => item.author_id)
}

function categoryIdsForBook(bookId) {
  return state.bookCategories.filter((item) => item.book_id === bookId).map((item) => item.category_id)
}

function authorsForBook(bookId) {
  return authorIdsForBook(bookId)
    .map((authorId) => state.authors.find((author) => author.author_id === authorId))
    .filter(Boolean)
}

function categoriesForBook(bookId) {
  return categoryIdsForBook(bookId)
    .map((categoryId) => state.categories.find((category) => category.category_id === categoryId))
    .filter(Boolean)
}

function reviewsForBook(bookId) {
  return state.rates
    .filter((rate) => rate.book_id === bookId)
    .map((rate) => {
      const user = state.users.find((item) => item.user_id === rate.user_id)

      return {
        ...rate,
        user_name: user?.fullname || user?.user_name || "Anonymous Reader",
      }
    })
    .sort((left, right) => new Date(right.Created_at) - new Date(left.Created_at))
}

function recalculateBookMetrics(bookId) {
  const book = state.books.find((item) => item.book_id === bookId)

  if (!book) {
    return
  }

  const rates = state.rates.filter((rate) => rate.book_id === bookId)
  const downloads = state.accessLogs.filter((log) => log.book_id === bookId && log.access_type === "download").length
  const views = state.accessLogs.filter((log) => log.book_id === bookId && ["preview", "read"].includes(log.access_type)).length

  book.total_rate = rates.length
  book.average_score = rates.length
    ? Number((rates.reduce((total, item) => total + item.Rating_score, 0) / rates.length).toFixed(2))
    : 0
  book.total_download = downloads
  book.total_view = views
}

function enrichBook(book) {
  return {
    ...book,
    authors: authorsForBook(book.book_id),
    categories: categoriesForBook(book.book_id),
    reviews: reviewsForBook(book.book_id),
  }
}

function filterBooks({ search = "", categoryId = "", authorId = "" } = {}) {
  const searchValue = String(search).trim().toLowerCase()

  return state.books
    .map((book) => enrichBook(book))
    .filter((book) => {
      const matchesSearch =
        !searchValue ||
        book.title.toLowerCase().includes(searchValue) ||
        String(book.isbn || "").toLowerCase().includes(searchValue)

      const matchesCategory =
        !categoryId || book.categories.some((category) => category.category_id === Number(categoryId))

      const matchesAuthor =
        !authorId || book.authors.some((author) => author.author_id === Number(authorId))

      return matchesSearch && matchesCategory && matchesAuthor
    })
}

function categoryOptions() {
  return state.categories.map((category) => ({
    ...category,
    book_count: state.bookCategories.filter((item) => item.category_id === category.category_id).length,
  }))
}

function authorOptions() {
  return state.authors.map((author) => ({
    ...author,
    book_count: state.bookAuthors.filter((item) => item.author_id === author.author_id).length,
  }))
}

function buildDashboardData(filters = {}) {
  const books = filterBooks(filters)

  return {
    summary: {
      total_books: state.books.length,
      total_authors: state.authors.length,
      total_categories: state.categories.length,
      total_downloads: state.books.reduce((total, book) => total + book.total_download, 0),
    },
    filters: {
      categories: categoryOptions(),
      authors: authorOptions(),
    },
    books,
  }
}

function buildProfile(userId) {
  const fallbackUser = state.users.find((user) => user.role_id === 2) || state.users[0]
  const user = state.users.find((item) => item.user_id === Number(userId)) || fallbackUser
  const history = state.accessLogs
    .filter((log) => log.user_id === user.user_id)
    .map((log) => {
      const book = state.books.find((item) => item.book_id === log.book_id)

      return {
        ...log,
        title: book?.title || "Unknown Book",
        isbn: book?.isbn || "N/A",
      }
    })
    .sort((left, right) => new Date(right.Accessed_at) - new Date(left.Accessed_at))

  return {
    user: {
      ...user,
      role_name: roleNameFromId(user.role_id),
    },
    summary: {
      total_logs: history.length,
      total_downloads: history.filter((item) => item.access_type === "download").length,
      total_reads: history.filter((item) => ["preview", "read"].includes(item.access_type)).length,
    },
    history,
  }
}

function nextId(items, field) {
  return items.length ? Math.max(...items.map((item) => Number(item[field]) || 0)) + 1 : 1
}

export const libraryApi = {
  async getHomeDashboard(filters = {}) {
    return withFallback(
      () => fetchJson(`/dashboard?search=${encodeURIComponent(filters.search || "")}&categoryId=${filters.categoryId || ""}&authorId=${filters.authorId || ""}`),
      () => buildDashboardData(filters),
    )
  },

  async getBookDetail(bookId) {
    return withFallback(
      () => fetchJson(`/books/${bookId}`),
      () => {
        const book = state.books.find((item) => item.book_id === Number(bookId))

        if (!book) {
          throw new Error("Book not found")
        }

        return enrichBook(book)
      },
    )
  },

  async submitReview(bookId, payload, currentUser) {
    return withFallback(
      () =>
        fetchJson(`/books/${bookId}/reviews`, {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      () => {
        if (!currentUser) {
          throw new Error("Please log in to submit a review")
        }

        const existing = state.rates.find(
          (rate) => rate.book_id === Number(bookId) && rate.user_id === Number(currentUser.id),
        )

        if (existing) {
          existing.Rating_score = Number(payload.Rating_score)
          existing.Review_text = payload.Review_text
          existing.Created_at = new Date().toISOString()
        } else {
          state.rates.push({
            user_id: Number(currentUser.id),
            book_id: Number(bookId),
            Rating_score: Number(payload.Rating_score),
            Review_text: payload.Review_text,
            Created_at: new Date().toISOString(),
          })
        }

        recalculateBookMetrics(Number(bookId))
        return enrichBook(state.books.find((item) => item.book_id === Number(bookId)))
      },
    )
  },

  async getUserProfile(userId) {
    return withFallback(
      () => fetchJson(`/profile/${userId}`),
      () => buildProfile(userId),
    )
  },

  async getMasterData() {
    return withFallback(
      () => fetchJson("/master-data"),
      () => ({
        books: state.books.map((book) => enrichBook(book)),
        authors: authorOptions(),
        categories: categoryOptions(),
        roles: state.roles,
      }),
    )
  },

  async saveBook(payload) {
    return withFallback(
      () => {
        const path = payload.book_id ? `/books/${payload.book_id}` : "/books"
        const method = payload.book_id ? "PUT" : "POST"

        return fetchJson(path, {
          method,
          body: JSON.stringify(payload),
        })
      },
      () => {
        const normalizedBook = {
          title: payload.title,
          Publisher_name: payload.Publisher_name,
          Published_year: Number(payload.Published_year) || null,
          total_page: Number(payload.total_page) || null,
          file_format: payload.file_format,
          isbn: payload.isbn,
          downloadable: payload.downloadable ? 1 : 0,
          file_size: payload.file_size,
          file_url: payload.file_url,
          preview_url: payload.preview_url,
          description: payload.description,
        }

        let bookId = Number(payload.book_id)

        if (bookId) {
          const target = state.books.find((book) => book.book_id === bookId)
          Object.assign(target, normalizedBook)
        } else {
          bookId = nextId(state.books, "book_id")
          state.books.unshift({
            book_id: bookId,
            average_score: 0,
            total_rate: 0,
            total_download: 0,
            total_view: 0,
            ...normalizedBook,
          })
        }

        state.bookAuthors = state.bookAuthors.filter((item) => item.book_id !== bookId)
        state.bookCategories = state.bookCategories.filter((item) => item.book_id !== bookId)

        payload.author_ids.forEach((authorId) => {
          state.bookAuthors.push({
            book_id: bookId,
            author_id: Number(authorId),
          })
        })

        payload.category_ids.forEach((categoryId) => {
          state.bookCategories.push({
            book_id: bookId,
            category_id: Number(categoryId),
          })
        })

        return enrichBook(state.books.find((book) => book.book_id === bookId))
      },
    )
  },
}
