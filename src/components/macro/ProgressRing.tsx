import type { ReactNode } from "react"

interface ProgressRingProps {
  percent: number
  size: number
  strokeWidth?: number
  color: string
  trackColor?: string
  children?: ReactNode
}

export function ProgressRing({
  percent,
  size,
  strokeWidth = 8,
  color,
  trackColor = "var(--color-frame-bg)",
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped / 100)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}
