import RatingStars from "./RatingStars"

function ReviewList({ reviews }) {
  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No reviews yet. Be the first reader to rate this title.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card" key={`${review.user_id}-${review.book_id}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">{review.user_name}</h4>
              <p className="text-sm text-slate-500">
                {new Date(review.Created_at).toLocaleDateString()}
              </p>
            </div>
            <RatingStars readOnly value={review.Rating_score} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{review.Review_text}</p>
        </article>
      ))}
    </div>
  )
}

export default ReviewList
