import { cn } from "@/lib/utils"

const DOT_COLOR = {
  protein: "bg-protein",
  carbs: "bg-carbs",
  fat: "bg-fat",
} as const

interface MacroDotStatProps {
  type: keyof typeof DOT_COLOR
  label: string
  value: string
}

export function MacroDotStat({ type, label, value }: MacroDotStatProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-ink">
      <span className={cn("size-2 rounded-full", DOT_COLOR[type])} />
      <span className="text-ink-soft">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
