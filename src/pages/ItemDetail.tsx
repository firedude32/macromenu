import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, BadgeCheck, Flag } from "lucide-react"
import { restaurants, menuItems, combos, demoUser } from "@/data"
import type { Macros } from "@/data"
import { restaurantRecommendables, type Recommendable } from "@/lib/recommend"
import { fitScore } from "@/lib/score"
import { VerifiedBadge } from "@/components/badges/VerifiedBadge"
import { ScoreBadge } from "@/components/macro/ScoreBadge"
import { MacroGrid } from "@/components/macro/MacroGrid"
import { restaurantColor, restaurantInitial } from "@/components/restaurant/restaurantVisuals"
import { PagePlaceholder } from "./PagePlaceholder"

interface SwapDelta {
  pick: Recommendable & { score: number }
  calDelta: number
  proteinDelta: number
}

function deltaLabel({ calDelta, proteinDelta }: SwapDelta): string {
  const cal = `${calDelta > 0 ? "+" : ""}${calDelta} cal`
  const protein = `${proteinDelta > 0 ? "+" : ""}${proteinDelta}g protein`
  return `${cal}, ${protein}`
}

export function ItemDetail() {
  const { restaurantId, itemId } = useParams()
  const navigate = useNavigate()

  const restaurant = restaurants.find((r) => r.id === restaurantId)

  const pick = useMemo(() => {
    if (!restaurantId) return undefined
    return restaurantRecommendables(restaurantId).find((r) => r.id === itemId)
  }, [restaurantId, itemId])

  // The trust line and serving/allergen fields live only on the raw
  // MenuItem/Combo records, not on the slimmer Recommendable shape.
  const source = useMemo(() => {
    if (!restaurantId || !itemId) return undefined
    return (
      menuItems.find((i) => i.restaurantId === restaurantId && i.id === itemId) ??
      combos.find((c) => c.restaurantId === restaurantId && c.id === itemId)
    )
  }, [restaurantId, itemId])

  const score = useMemo(() => (pick ? fitScore(pick, demoUser) : 0), [pick])

  const swaps = useMemo(() => {
    if (!restaurantId || !pick) return []
    return restaurantRecommendables(restaurantId)
      .filter((r) => r.id !== pick.id)
      .map((r) => ({ ...r, score: fitScore(r, demoUser) }))
      .filter((r) => r.score > score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => ({
        pick: r,
        calDelta: r.cal - pick.cal,
        proteinDelta: r.protein - pick.protein,
      }))
  }, [restaurantId, pick, score])

  if (!restaurant || !pick || !source) {
    return <PagePlaceholder title="Item" />
  }

  const macros: Macros = pick

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center justify-between px-5 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <ArrowLeft className="size-5 text-ink" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 px-5 text-center">
        <span
          className={`flex size-16 items-center justify-center rounded-tile text-2xl font-extrabold text-white ${restaurantColor(restaurant.id)}`}
        >
          {restaurantInitial(restaurant.name)}
        </span>
        <h1 className="text-2xl font-extrabold text-ink">{pick.name}</h1>
        <div className="flex items-center gap-3">
          {pick.verified && <VerifiedBadge />}
        </div>
        <ScoreBadge value={score} />
      </div>

      <div className="flex flex-col gap-4 px-5">
        {pick.kind === "combo" && (
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">Order:</span> {pick.orderLine}
          </p>
        )}

        <MacroGrid {...macros} />

        {"servingSize" in source &&
          (source.servingSize || (source.allergens && source.allergens.length > 0)) && (
            <div className="flex flex-col gap-1 rounded-tile bg-card p-3 text-sm text-ink-soft">
              {source.servingSize && (
                <p>
                  <span className="font-semibold text-ink">Serving size:</span> {source.servingSize}
                </p>
              )}
              {source.allergens && source.allergens.length > 0 && (
                <p>
                  <span className="font-semibold text-ink">Allergens:</span>{" "}
                  {source.allergens.join(", ")}
                </p>
              )}
            </div>
          )}

        {source.auditedOn && (
          <div className="flex flex-col gap-2 rounded-tile bg-card p-3">
            <p className="flex items-start gap-2 text-sm text-ink">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              Verified against official {restaurant.name} nutrition data. Last audited{" "}
              {source.auditedOn}.
            </p>
            <button
              type="button"
              onClick={() =>
                console.log("Report an issue", { restaurantId: restaurant.id, itemId: pick.id })
              }
              className="flex items-center gap-1 self-start text-xs font-semibold text-ink-soft"
            >
              <Flag className="size-3.5" />
              Report an issue
            </button>
          </div>
        )}

        {swaps.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-extrabold text-ink">Healthier Swaps</h2>
            <div className="flex flex-col gap-2">
              {swaps.map((swap) => (
                <button
                  key={swap.pick.id}
                  type="button"
                  onClick={() =>
                    swap.pick.kind === "item" &&
                    navigate(`/item/${restaurant.id}/${swap.pick.id}`)
                  }
                  className="flex items-center justify-between gap-3 rounded-tile bg-card p-3 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-ink">{swap.pick.name}</span>
                    <span className="text-xs font-bold text-green-bright">
                      {deltaLabel(swap)}
                    </span>
                  </div>
                  <ScoreBadge value={swap.pick.score} size={44} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
