import { startTransition } from "react"

function FilterBar({
  authors,
  categories,
  filters,
  onChange,
  onReset,
}) {
  return (
    <div className="panel p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr,1fr,auto]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="search">
            Search by title
          </label>
          <input
            className="input-base"
            id="search"
            onChange={(event) => {
              const nextValue = event.target.value
              startTransition(() => onChange("search", nextValue))
            }}
            placeholder="Search books..."
            value={filters.search}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            className="input-base"
            id="category"
            onChange={(event) => onChange("categoryId", event.target.value)}
            value={filters.categoryId}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="author">
            Author
          </label>
          <select
            className="input-base"
            id="author"
            onChange={(event) => onChange("authorId", event.target.value)}
            value={filters.authorId}
          >
            <option value="">All authors</option>
            {authors.map((author) => (
              <option key={author.author_id} value={author.author_id}>
                {author.author_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button className="button-secondary w-full justify-center" onClick={onReset} type="button">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
