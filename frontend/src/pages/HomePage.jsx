import { useDeferredValue, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import BookCard from "../components/BookCard"
import FilterBar from "../components/FilterBar"
import { libraryApi } from "../services/libraryApi"

const initialDashboard = {
  summary: {
    total_books: 0,
    total_authors: 0,
    total_categories: 0,
    total_downloads: 0,
  },
  filters: {
    categories: [],
    authors: [],
  },
  books: [],
}

function HomePage({ catalogMode = false }) {
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    authorId: "",
  })
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const deferredSearch = useDeferredValue(filters.search)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        const data = await libraryApi.getHomeDashboard({
          search: deferredSearch,
          categoryId: filters.categoryId,
          authorId: filters.authorId,
        })

        if (!ignore) {
          setDashboard(data)
          setError("")
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Failed to load library dashboard")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [deferredSearch, filters.authorId, filters.categoryId])

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      authorId: "",
    })
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-soft">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.2fr,0.8fr] lg:px-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">
              Online Library Management System
            </span>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {catalogMode ? "Explore the digital collection" : "Discover books, authors, and reading activity"}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Built directly from your MS SQL Server schema with Books, Authors, Categories, Ratings, Roles, and Access Logs in mind.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button-accent" to="/profile">
                Open profile
              </Link>
              <Link className="button-secondary border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white" to="/admin">
                Open admin dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Books</p>
              <p className="mt-3 font-display text-3xl font-bold">{dashboard.summary.total_books}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Authors</p>
              <p className="mt-3 font-display text-3xl font-bold">{dashboard.summary.total_authors}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Categories</p>
              <p className="mt-3 font-display text-3xl font-bold">{dashboard.summary.total_categories}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">Downloads</p>
              <p className="mt-3 font-display text-3xl font-bold">{dashboard.summary.total_downloads}</p>
            </div>
          </div>
        </div>
      </section>

      <FilterBar
        authors={dashboard.filters.authors}
        categories={dashboard.filters.categories}
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
      />

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Book Dashboard</h2>
            <p className="section-copy">
              Showing title, average score, cover preview, author links, and filter states based on your schema.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {loading ? "Loading books..." : `${dashboard.books.length} books found`}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[18rem] items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
          </div>
        ) : dashboard.books.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.books.map((book) => (
              <BookCard book={book} key={book.book_id} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h3 className="font-display text-xl font-bold text-slate-900">No books matched the current filters</h3>
            <p className="mt-2 text-sm text-slate-500">Try clearing the search text, author filter, or category filter.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
