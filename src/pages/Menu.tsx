import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { demoUser } from "@/data"
import { suggestedMealsFeed, whyThisPick } from "@/lib/recommend"
import { RecommendationCard } from "@/components/restaurant/RecommendationCard"

export function Menu() {
  const navigate = useNavigate()
  const feed = useMemo(() => suggestedMealsFeed(demoUser), [])

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center gap-3 px-5 pt-2">
        <span className="flex size-9 items-center justify-center rounded-tile bg-cta-black">
          <Sparkles className="size-5 text-white" />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">Suggested Meals</h1>
      </div>

      <div className="flex flex-col gap-4 px-5">
        {feed.map((pick) => (
          <RecommendationCard
            key={`${pick.restaurantId}-${pick.id}`}
            title={pick.name}
            score={pick.score}
            orderLine={pick.orderLine}
            macros={pick}
            whyText={whyThisPick(pick, demoUser)}
            verified={pick.verified}
            restaurantId={pick.restaurantId}
            restaurantName={pick.restaurantName}
            showOrderNow
            onTap={
              pick.kind === "item"
                ? () => navigate(`/item/${pick.restaurantId}/${pick.id}`)
                : undefined
            }
          />
        ))}
        {feed.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-soft">No suggestions yet.</p>
        )}
      </div>
    </div>
  )
}
