import { useState } from "react"

import MultiSelectDropdown from "./MultiSelectDropdown"

const defaultForm = {
  book_id: "",
  title: "",
  Publisher_name: "",
  Published_year: "",
  total_page: "",
  file_format: "PDF",
  isbn: "",
  downloadable: true,
  file_size: "",
  file_url: "",
  preview_url: "",
  description: "",
  author_ids: [],
  category_ids: [],
}

const createFormState = (editingBook) => {
  if (!editingBook) {
    return defaultForm
  }

  return {
    book_id: editingBook.book_id,
    title: editingBook.title || "",
    Publisher_name: editingBook.Publisher_name || "",
    Published_year: editingBook.Published_year || "",
    total_page: editingBook.total_page || "",
    file_format: editingBook.file_format || "PDF",
    isbn: editingBook.isbn || "",
    downloadable: Boolean(editingBook.downloadable),
    file_size: editingBook.file_size || "",
    file_url: editingBook.file_url || "",
    preview_url: editingBook.preview_url || "",
    description: editingBook.description || "",
    author_ids: editingBook.authors.map((author) => author.author_id),
    category_ids: editingBook.categories.map((category) => category.category_id),
  }
}

function BookManagementForm({
  authors,
  categories,
  editingBook,
  onCancel,
  onSubmit,
  saving,
}) {
  const [form, setForm] = useState(() => createFormState(editingBook))

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="panel space-y-6 p-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title text-2xl">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <p className="section-copy">
            Manage the main `Book` record plus `Book_Author` and `Book_Category` assignments.
          </p>
        </div>

        {editingBook && (
          <button className="button-secondary" onClick={onCancel} type="button">
            Clear form
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="title">
            Title
          </label>
          <input
            className="input-base"
            id="title"
            onChange={(event) => updateField("title", event.target.value)}
            required
            value={form.title}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="publisher">
            Publisher
          </label>
          <input
            className="input-base"
            id="publisher"
            onChange={(event) => updateField("Publisher_name", event.target.value)}
            value={form.Publisher_name}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="isbn">
            ISBN
          </label>
          <input
            className="input-base"
            id="isbn"
            onChange={(event) => updateField("isbn", event.target.value)}
            required
            value={form.isbn}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="format">
            File Format
          </label>
          <select
            className="input-base"
            id="format"
            onChange={(event) => updateField("file_format", event.target.value)}
            value={form.file_format}
          >
            {["PDF", "EPUB", "DOCX", "PPTX"].map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="year">
            Published Year
          </label>
          <input
            className="input-base"
            id="year"
            min="1900"
            onChange={(event) => updateField("Published_year", event.target.value)}
            type="number"
            value={form.Published_year}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="pages">
            Total Pages
          </label>
          <input
            className="input-base"
            id="pages"
            min="1"
            onChange={(event) => updateField("total_page", event.target.value)}
            type="number"
            value={form.total_page}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="file-size">
            File Size
          </label>
          <input
            className="input-base"
            id="file-size"
            onChange={(event) => updateField("file_size", event.target.value)}
            placeholder="e.g. 12 MB"
            value={form.file_size}
          />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            checked={form.downloadable}
            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
            id="downloadable"
            onChange={(event) => updateField("downloadable", event.target.checked)}
            type="checkbox"
          />
          <label className="text-sm font-semibold text-slate-700" htmlFor="downloadable">
            Allow download
          </label>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="file-url">
            File URL
          </label>
          <input
            className="input-base"
            id="file-url"
            onChange={(event) => updateField("file_url", event.target.value)}
            placeholder="https://example.com/files/book.pdf"
            value={form.file_url}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="preview-url">
            Preview / Cover URL
          </label>
          <input
            className="input-base"
            id="preview-url"
            onChange={(event) => updateField("preview_url", event.target.value)}
            placeholder="https://example.com/image.jpg"
            value={form.preview_url}
          />
        </div>

        <div className="md:col-span-2">
          <MultiSelectDropdown
            label="Authors"
            onChange={(values) => updateField("author_ids", values)}
            options={authors.map((author) => ({
              value: author.author_id,
              label: author.author_name,
              meta: author.bio,
            }))}
            placeholder="Select one or more authors"
            selectedValues={form.author_ids}
          />
        </div>

        <div className="md:col-span-2">
          <MultiSelectDropdown
            label="Categories"
            onChange={(values) => updateField("category_ids", values)}
            options={categories.map((category) => ({
              value: category.category_id,
              label: category.category_name,
              meta: `${category.book_count} books`,
            }))}
            placeholder="Select one or more categories"
            selectedValues={form.category_ids}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            className="textarea-base"
            id="description"
            onChange={(event) => updateField("description", event.target.value)}
            value={form.description}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="button-accent justify-center" disabled={saving} type="submit">
          {saving ? "Saving..." : editingBook ? "Update Book" : "Create Book"}
        </button>
        <button className="button-secondary justify-center" onClick={onCancel} type="button">
          Reset
        </button>
      </div>
    </form>
  )
}

export default BookManagementForm
