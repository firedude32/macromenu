import { ScoreBadge } from "@/components/macro/ScoreBadge"
import { MacroGrid } from "@/components/macro/MacroGrid"
import { WhyThisPick } from "@/components/macro/WhyThisPick"
import { VerifiedBadge } from "@/components/badges/VerifiedBadge"
import { restaurantColor, restaurantInitial } from "@/components/restaurant/restaurantVisuals"
import { cn } from "@/lib/utils"
import type { Macros } from "@/data"

interface RecommendationCardProps {
  title: string
  score: number
  orderLine: string
  macros: Macros
  whyText: string
  verified?: boolean
  onTap?: () => void
  /** Cross-restaurant feed only (SPEC §5.7): shows the restaurant's logo + name. */
  restaurantId?: string
  restaurantName?: string
  /** Black "Order Now" pill (SPEC §5.7). Defaults to onTap when shown. */
  showOrderNow?: boolean
}

export function RecommendationCard({
  title,
  score,
  orderLine,
  macros,
  whyText,
  verified,
  onTap,
  restaurantId,
  restaurantName,
  showOrderNow,
}: RecommendationCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {restaurantId && restaurantName && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
              restaurantColor(restaurantId),
            )}
          >
            {restaurantInitial(restaurantName)}
          </span>
          <span className="text-xs font-semibold text-ink-soft">{restaurantName}</span>
        </div>
      )}
      <div
        role={onTap ? "button" : undefined}
        tabIndex={onTap ? 0 : undefined}
        onClick={onTap}
        onKeyDown={onTap ? (e) => e.key === "Enter" && onTap() : undefined}
        className="flex flex-col gap-3"
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
      {showOrderNow && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onTap?.()
          }}
          className="w-full rounded-full bg-cta-black py-3 text-center text-sm font-bold text-white"
        >
          Order Now
        </button>
      )}
    </div>
  )
}
