import { Flame, Dumbbell, Wheat, Droplet } from "lucide-react"
import { cn } from "@/lib/utils"

interface MacroGridProps {
  cal: number
  protein: number
  carbs: number
  fat: number
}

const TILES = (p: MacroGridProps) => [
  { icon: Flame, label: "Calories", value: `${p.cal}`, bg: "bg-cal", text: "text-cal" },
  { icon: Dumbbell, label: "Protein", value: `${p.protein}g`, bg: "bg-protein", text: "text-protein" },
  { icon: Wheat, label: "Carbs", value: `${p.carbs}g`, bg: "bg-carbs", text: "text-carbs" },
  { icon: Droplet, label: "Fat", value: `${p.fat}g`, bg: "bg-fat", text: "text-fat" },
]

export function MacroGrid(props: MacroGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TILES(props).map(({ icon: Icon, label, value, bg, text }) => (
        <div key={label} className="flex items-center gap-3 rounded-tile bg-card p-3">
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", bg)}>
            <Icon className="size-5 text-white" strokeWidth={2} />
          </span>
          <div className="flex flex-col">
            <span className={cn("text-lg font-extrabold", text)}>{value}</span>
            <span className="text-xs text-ink-soft">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
