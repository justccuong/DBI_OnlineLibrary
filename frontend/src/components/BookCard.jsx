import { Link } from "react-router-dom"

import RatingStars from "./RatingStars"

function BookCard({ book }) {
  const averageScore = Number(book.average_score || 0)

  return (
    <article className="panel overflow-hidden">
      <Link className="block" to={`/books/${book.book_id}`}>
        <div className="relative h-60 overflow-hidden bg-slate-200">
          <img
            alt={book.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = "/library_view.png"
            }}
            src={book.preview_url}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 text-white">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {book.categories.slice(0, 2).map((category) => (
                <span
                  className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur"
                  key={category.category_id}
                >
                  {category.category_name}
                </span>
              ))}
            </div>
            <h3 className="font-display text-lg font-bold leading-tight">{book.title}</h3>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">
              {book.authors.map((author) => author.author_name).join(", ")}
            </p>
            <p className="text-sm text-slate-500">ISBN: {book.isbn}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <RatingStars readOnly size="sm" value={averageScore} />
              <span className="text-sm font-semibold text-slate-800">{averageScore.toFixed(1)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{book.total_rate} reviews</p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{book.description}</p>

        <div className="flex items-center justify-between">
          <span className="tag">{book.file_format}</span>
          <Link className="text-sm font-semibold text-brand-600 transition hover:text-brand-700" to={`/books/${book.book_id}`}>
            View detail
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BookCard
