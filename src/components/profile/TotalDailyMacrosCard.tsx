import { ProgressRing } from "@/components/macro/ProgressRing"
import { formatCalories } from "@/lib/utils"

interface TotalDailyMacrosCardProps {
  cal: number
  protein: number
  carbs: number
  fat: number
}

const LEGEND = (p: TotalDailyMacrosCardProps) => [
  { label: "Protein", value: p.protein, kcalPerG: 4, color: "var(--color-protein)" },
  { label: "Carbs", value: p.carbs, kcalPerG: 4, color: "var(--color-carbs)" },
  { label: "Fat", value: p.fat, kcalPerG: 9, color: "var(--color-fat)" },
]

/** Reusable "Total Daily Macros" card — Profile (§5.8) and Onboarding both
 * render the same targets from the same profile shape. */
export function TotalDailyMacrosCard(props: TotalDailyMacrosCardProps) {
  const legend = LEGEND(props)

  return (
    <div className="flex items-center gap-5 rounded-card bg-card p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <ProgressRing percent={100} size={104} strokeWidth={10} color="var(--color-cal)">
        <div className="flex flex-col items-center">
          <span className="text-xl font-extrabold text-ink">{formatCalories(props.cal)}</span>
          <span className="text-[10px] font-semibold uppercase text-ink-soft">Calorie</span>
        </div>
      </ProgressRing>

      <div className="flex flex-1 flex-col gap-3">
        {legend.map(({ label, value, kcalPerG, color }) => {
          const percent = props.cal > 0 ? Math.round(((value * kcalPerG) / props.cal) * 100) : 0
          return (
            <div key={label} className="flex items-center gap-3">
              <ProgressRing percent={percent} size={32} strokeWidth={5} color={color} />
              <div className="flex flex-1 items-baseline justify-between">
                <span className="text-sm font-semibold text-ink">
                  {label} {value}g
                </span>
                <span className="text-xs font-bold text-ink-soft">{percent}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
