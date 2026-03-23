import { useEffect, useState } from "react"

import AdminSidebar from "../components/AdminSidebar"
import BookManagementForm from "../components/BookManagementForm"
import MasterDataTable from "../components/MasterDataTable"
import { libraryApi } from "../services/libraryApi"

function AdminPage() {
  const [activeSection, setActiveSection] = useState("books")
  const [masterData, setMasterData] = useState({
    books: [],
    authors: [],
    categories: [],
    roles: [],
  })
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState("")

  const loadMasterData = async () => {
    try {
      setLoading(true)
      const data = await libraryApi.getMasterData()
      setMasterData(data)
      setFeedback("")
    } catch (error) {
      setFeedback(error.message || "Failed to load master data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMasterData()
  }, [])

  const handleSaveBook = async (payload) => {
    try {
      setSaving(true)
      await libraryApi.saveBook(payload)
      setEditingBook(null)
      setFeedback("Book saved successfully.")
      await loadMasterData()
    } catch (error) {
      setFeedback(error.message || "Failed to save book")
    } finally {
      setSaving(false)
    }
  }

  const selectedContent = {
    authors: (
      <MasterDataTable
        columns={[
          { key: "author_id", label: "ID" },
          { key: "author_name", label: "Author Name" },
          { key: "book_count", label: "Linked Books" },
          { key: "bio", label: "Bio" },
        ]}
        description="Author master data coming from the `Author` table and `Book_Author` relationships."
        rows={masterData.authors}
        title="Author Management"
      />
    ),
    categories: (
      <MasterDataTable
        columns={[
          { key: "category_id", label: "ID" },
          { key: "category_name", label: "Category Name" },
          { key: "book_count", label: "Book Count" },
        ]}
        description="Category master data used by the dashboard filter and `Book_Category` assignments."
        rows={masterData.categories}
        title="Category Management"
      />
    ),
    roles: (
      <MasterDataTable
        columns={[
          { key: "role_id", label: "ID" },
          { key: "role_name", label: "Role Name" },
          { key: "max_download_per_day", label: "Max Downloads / Day" },
        ]}
        description="Roles define download permissions and admin access for the library system."
        rows={masterData.roles}
        title="Role Management"
      />
    ),
  }[activeSection]

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Books</p>
          <p className="mt-3 font-display text-3xl font-bold">{masterData.books.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Authors</p>
          <p className="mt-3 font-display text-3xl font-bold">{masterData.authors.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Categories</p>
          <p className="mt-3 font-display text-3xl font-bold">{masterData.categories.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Roles</p>
          <p className="mt-3 font-display text-3xl font-bold">{masterData.roles.length}</p>
        </div>
      </section>

      {feedback && (
        <div className="rounded-3xl border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-700">
          {feedback}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[18rem,1fr]">
        <AdminSidebar activeSection={activeSection} onChange={setActiveSection} />

        <div className="space-y-6">
          {activeSection === "books" ? (
            <>
              <BookManagementForm
                authors={masterData.authors}
                categories={masterData.categories}
                editingBook={editingBook}
                key={editingBook?.book_id || "new-book"}
                onCancel={() => setEditingBook(null)}
                onSubmit={handleSaveBook}
                saving={saving}
              />

              <section className="panel overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="section-title text-2xl">Existing Books</h2>
                  <p className="section-copy">
                    Click edit to load the current book into the management form.
                  </p>
                </div>

                {loading ? (
                  <div className="flex min-h-[12rem] items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {masterData.books.map((book) => (
                      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between" key={book.book_id}>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-slate-900">{book.title}</h3>
                          <p className="text-sm text-slate-500">ISBN: {book.isbn}</p>
                          <div className="flex flex-wrap gap-2">
                            {book.authors.map((author) => (
                              <span className="tag" key={author.author_id}>
                                {author.author_name}
                              </span>
                            ))}
                            {book.categories.map((category) => (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600" key={category.category_id}>
                                {category.category_name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="button-secondary justify-center" onClick={() => setEditingBook(book)} type="button">
                          Edit book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            selectedContent
          )}
        </div>
      </section>
    </div>
  )
}

export default AdminPage
