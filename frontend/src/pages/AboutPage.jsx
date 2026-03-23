function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden bg-slate-950 text-white">
        <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.1fr,0.9fr] lg:px-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">
              About the System
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Online Library Management System
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              A responsive React frontend designed around your MS SQL Server schema for books, roles, authors, categories, reviews, and access logs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Book discovery with search and filters",
              "Detailed book metadata and preview access",
              "Reader reviews based on the Rate table",
              "Admin master-data management dashboard",
            ].map((feature) => (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200" key={feature}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="section-title text-2xl">Schema-Driven UI</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Every screen in this frontend maps back to your database design. Books combine metadata from
            `Book`, people information from `Author`, taxonomy from `Category`, ratings from `Rate`, and
            user activity from `Access_log`.
          </p>
        </div>

        <div className="panel p-6">
          <h2 className="section-title text-2xl">Frontend Structure</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The project uses React Router for page navigation, TailwindCSS for responsive styling, and a
            mock API service layer so you can continue building UI even before the full backend endpoints are ready.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
