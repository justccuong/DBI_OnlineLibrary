const sections = [
  { id: "books", label: "Books" },
  { id: "authors", label: "Authors" },
  { id: "categories", label: "Categories" },
  { id: "roles", label: "Roles" },
]

function AdminSidebar({ activeSection, onChange }) {
  return (
    <aside className="panel h-fit p-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        Master Data
      </p>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeSection === section.id
                ? "bg-slate-950 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            key={section.id}
            onClick={() => onChange(section.id)}
            type="button"
          >
            <span>{section.label}</span>
            <span className="text-xs uppercase">{section.id}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
