function MasterDataTable({
  title,
  description,
  columns,
  rows,
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="font-display text-xl font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th className="px-6 py-4 text-left font-semibold text-slate-700" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr className="hover:bg-slate-50" key={`${title}-${index}`}>
                {columns.map((column) => (
                  <td className="px-6 py-4 text-slate-600" key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MasterDataTable
