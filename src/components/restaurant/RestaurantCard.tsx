import { Heart } from "lucide-react"
import type { Restaurant } from "@/data"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/badges/StatusBadge"
import { PriceTier } from "@/components/badges/PriceTier"
import { restaurantColor, restaurantInitial } from "./restaurantVisuals"

interface RestaurantCardProps {
  restaurant: Restaurant
  onTap: (restaurant: Restaurant) => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function RestaurantCard({
  restaurant,
  onTap,
  isFavorite,
  onToggleFavorite,
}: RestaurantCardProps) {
  return (
    <div className="flex w-40 shrink-0 flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTap(restaurant)}
        onKeyDown={(e) => e.key === "Enter" && onTap(restaurant)}
        className="relative block cursor-pointer transition-transform active:scale-[0.98]"
      >
        <span
          className={cn(
            "flex h-24 w-full items-center justify-center rounded-tile text-3xl font-extrabold text-white",
            restaurantColor(restaurant.id),
          )}
        >
          {restaurantInitial(restaurant.name)}
        </span>
        <span className="absolute left-2 top-2">
          <StatusBadge status={restaurant.open ? "open" : "closed"} />
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(restaurant.id)
          }}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90"
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            className="size-4"
            color="var(--color-danger)"
            fill={isFavorite ? "var(--color-danger)" : "none"}
          />
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-bold text-ink">{restaurant.name}</span>
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span>{restaurant.distanceMi ?? "—"} mi</span>
          {restaurant.priceTier && <PriceTier tier={restaurant.priceTier} />}
        </div>
        {restaurant.favoriteCount != null && (
          <span className="flex items-center gap-1 text-xs text-ink-soft">
            <Heart className="size-3" color="var(--color-danger)" fill="var(--color-danger)" />
            {restaurant.favoriteCount}
          </span>
        )}
      </div>
    </div>
  )
}
