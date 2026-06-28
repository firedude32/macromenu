interface MacroRowProps {
  cal: number
  protein: number
  carbs: number
  fat: number
}

const STATS = (p: MacroRowProps) => [
  { value: `${p.cal}`, label: "CAL", color: "text-cal" },
  { value: `${p.protein}g`, label: "Protein", color: "text-protein" },
  { value: `${p.carbs}g`, label: "Carbs", color: "text-carbs" },
  { value: `${p.fat}g`, label: "Fats", color: "text-fat" },
]

export function MacroRow(props: MacroRowProps) {
  const stats = STATS(props)
  return (
    <div className="flex items-stretch">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex flex-1 flex-col items-center gap-0.5 px-2"
          style={i > 0 ? { borderLeft: "1px solid var(--color-frame-bg)" } : undefined}
        >
          <span className="text-base font-extrabold text-ink">{s.value}</span>
          <span className="text-[11px] uppercase text-ink-soft">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
