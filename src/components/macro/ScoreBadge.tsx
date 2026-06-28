import { cn } from "@/lib/utils"

const TIERS = [
  { min: 90, label: "EXCELLENT", color: "var(--color-green-bright)" },
  { min: 80, label: "GREAT", color: "var(--color-green-bright)" },
  { min: 70, label: "SOLID", color: "var(--color-primary)" },
  { min: 55, label: "GOOD", color: "var(--color-carbs)" },
  { min: 0, label: "OKAY", color: "var(--color-line)" },
] as const

function tierFor(value: number) {
  return TIERS.find((t) => value >= t.min) ?? TIERS[TIERS.length - 1]
}

export function ScoreBadge({ value, size = 64 }: { value: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  const tier = tierFor(clamped)
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped / 100)

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-frame-bg)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={tier.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-extrabold text-ink",
            size < 56 ? "text-base" : "text-xl",
          )}
        >
          {clamped}
        </div>
      </div>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
        {tier.label}
      </span>
    </div>
  )
}
