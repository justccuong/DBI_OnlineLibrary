function ProfileHistoryTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No reading or download history found yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Book", "ISBN", "Access Type", "Accessed At", "Device IP"].map((heading) => (
                <th className="px-5 py-4 text-left font-semibold text-slate-700" key={heading}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr className="hover:bg-slate-50" key={row.log_id}>
                <td className="px-5 py-4 font-medium text-slate-900">{row.title}</td>
                <td className="px-5 py-4 text-slate-500">{row.isbn}</td>
                <td className="px-5 py-4 capitalize text-slate-600">{row.access_type}</td>
                <td className="px-5 py-4 text-slate-500">
                  {new Date(row.Accessed_at).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-slate-500">{row.device_ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfileHistoryTable
