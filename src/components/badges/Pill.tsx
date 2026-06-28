import { cn } from "@/lib/utils"

export interface PillOption {
  value: string
  label: string
  emoji?: string
}

interface PillProps {
  options: PillOption[]
  value: string
  onChange: (value: string) => void
}

export function Pill({ options, value, onChange }: PillProps) {
  return (
    <div className="flex gap-1 rounded-full bg-frame-bg p-1">
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
              selected
                ? "bg-card text-ink shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                : "text-ink-soft",
            )}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
