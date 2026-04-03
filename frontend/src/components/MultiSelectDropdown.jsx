import { useState } from "react"

function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
}) {
  const [open, setOpen] = useState(false)

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value))
      return
    }

    onChange([...selectedValues, value])
  }

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <button
        className="input-base flex items-center justify-between text-left"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={selectedLabels.length ? "text-slate-900" : "text-slate-400"}>
          {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
        </span>
        <span className="text-xs font-semibold uppercase text-slate-400">
          {open ? "Hide" : "Select"}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-soft">
          <div className="space-y-2">
            {options.map((option) => {
              const checked = selectedValues.includes(option.value)

              return (
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-50"
                  key={option.value}
                >
                  <input
                    checked={checked}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    onChange={() => toggleValue(option.value)}
                    type="checkbox"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{option.label}</p>
                    {option.meta && <p className="text-xs text-slate-500">{option.meta}</p>}
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
