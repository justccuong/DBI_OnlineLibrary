import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import RatingStars from "../components/RatingStars"
import ReviewList from "../components/ReviewList"
import { useAuth } from "../context/AuthContext"
import { libraryApi } from "../services/libraryApi"

function BookDetailPage() {
  const { bookId } = useParams()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    Rating_score: 5,
    Review_text: "",
  })

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        setLoading(true)
        const data = await libraryApi.getBookDetail(bookId)

        if (!ignore) {
          setBook(data)
          setError("")
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message || "Failed to load the selected book")
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
  }, [bookId])

  const handleSubmitReview = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      const nextBook = await libraryApi.submitReview(book.book_id, reviewForm, user)
      setBook(nextBook)
      setReviewForm({
        Rating_score: 5,
        Review_text: "",
      })
      setError("")
    } catch (submitError) {
      setError(submitError.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
        {error}
      </div>
    )
  }

  const averageScore = Number(book.average_score || 0)

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-700">
          {error}
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="panel overflow-hidden">
          <img
            alt={book.title}
            className="h-full min-h-[28rem] w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = "/library_view.png"
            }}
            src={book.preview_url}
          />
        </div>

        <div className="space-y-6">
          <div className="panel space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="tag">{book.file_format}</span>
              {book.categories.map((category) => (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600" key={category.category_id}>
                  {category.category_name}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {book.title}
              </h1>
              <p className="text-sm leading-7 text-slate-600">{book.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RatingStars readOnly value={averageScore} />
              <p className="text-sm font-medium text-slate-700">
                {averageScore.toFixed(1)} average rating from {book.total_rate} review(s)
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Authors</p>
                <p className="mt-2 text-sm font-medium text-slate-800">
                  {book.authors.map((author) => author.author_name).join(", ")}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">ISBN</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{book.isbn}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {book.downloadable ? (
                <a className="button-accent" href={book.file_url || "#"} rel="noreferrer" target="_blank">
                  Download
                </a>
              ) : (
                <span className="inline-flex items-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500">
                  Download not available
                </span>
              )}
              <a className="button-secondary" href={book.preview_url} rel="noreferrer" target="_blank">
                Read Preview
              </a>
              <Link className="button-secondary" to="/catalog">
                Back to catalog
              </Link>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="section-title text-2xl">Book Metadata</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Publisher", book.Publisher_name || "N/A"],
                ["Published Year", book.Published_year || "N/A"],
                ["Total Pages", book.total_page || "N/A"],
                ["Format", book.file_format || "N/A"],
                ["File Size", book.file_size || "N/A"],
                ["Downloads", book.total_download],
                ["Views", book.total_view],
                ["Downloadable", book.downloadable ? "Yes" : "No"],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="panel p-6">
          <h2 className="section-title text-2xl">Rating & Review</h2>
          <p className="mt-2 text-sm text-slate-500">
            Submit a `Rating_score` from 1 to 5 and leave a `Review_text` for this book.
          </p>

          {user ? (
            <form className="mt-6 space-y-5" onSubmit={handleSubmitReview}>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Rating Score</label>
                <RatingStars
                  onChange={(nextScore) =>
                    setReviewForm((current) => ({
                      ...current,
                      Rating_score: nextScore,
                    }))
                  }
                  value={reviewForm.Rating_score}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="review">
                  Review Text
                </label>
                <textarea
                  className="textarea-base"
                  id="review"
                  onChange={(event) =>
                    setReviewForm((current) => ({
                      ...current,
                      Review_text: event.target.value,
                    }))
                  }
                  placeholder="Share your thoughts about this title..."
                  required
                  value={reviewForm.Review_text}
                />
              </div>

              <button className="button-primary" disabled={submitting} type="submit">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Please <Link className="font-semibold text-brand-600" to="/login">log in</Link> to submit a rating or review.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="section-title text-2xl">Past Reviews</h2>
            <p className="mt-2 text-sm text-slate-500">Pulled from the `Rate` table and joined with reader information.</p>
          </div>
          <ReviewList reviews={book.reviews} />
        </div>
      </section>
    </div>
  )
}

export default BookDetailPage
