import { ScoreBadge } from "@/components/macro/ScoreBadge"
import { MacroGrid } from "@/components/macro/MacroGrid"
import { WhyThisPick } from "@/components/macro/WhyThisPick"
import { VerifiedBadge } from "@/components/badges/VerifiedBadge"
import type { Macros } from "@/data"

interface RecommendationCardProps {
  title: string
  score: number
  orderLine: string
  macros: Macros
  whyText: string
  verified?: boolean
  onTap?: () => void
}

export function RecommendationCard({
  title,
  score,
  orderLine,
  macros,
  whyText,
  verified,
  onTap,
}: RecommendationCardProps) {
  return (
    <div
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      onClick={onTap}
      onKeyDown={onTap ? (e) => e.key === "Enter" && onTap() : undefined}
      className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex-1 text-lg font-extrabold leading-tight text-ink">{title}</h3>
        <ScoreBadge value={score} size={56} />
      </div>
      <p className="text-sm text-ink-soft">
        <span className="font-semibold text-ink">Order:</span> {orderLine}
      </p>
      <MacroGrid {...macros} />
      <WhyThisPick>{whyText}</WhyThisPick>
      {verified && <VerifiedBadge />}
    </div>
  )
}
