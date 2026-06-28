import { cn } from "@/lib/utils"

interface MoodChipProps {
  emoji: string
  label: string
  selected: boolean
  onClick: () => void
}

export function MoodChip({ emoji, label, selected, onClick }: MoodChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95",
        selected ? "bg-primary text-white" : "bg-card text-ink shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
      )}
    >
      <span>{emoji}</span>
      {label}
    </button>
  )
}
