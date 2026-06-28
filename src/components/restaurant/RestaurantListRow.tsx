import { ChevronRight } from "lucide-react"
import type { Restaurant } from "@/data"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/badges/StatusBadge"
import { PriceTier } from "@/components/badges/PriceTier"
import { restaurantColor, restaurantInitial } from "./restaurantVisuals"

interface RestaurantListRowProps {
  restaurant: Restaurant
  onTap: (restaurant: Restaurant) => void
}

export function RestaurantListRow({ restaurant, onTap }: RestaurantListRowProps) {
  return (
    <button
      type="button"
      onClick={() => onTap(restaurant)}
      className="flex w-full items-center gap-3 rounded-card bg-card p-3 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.98]"
    >
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white",
          restaurantColor(restaurant.id),
        )}
      >
        {restaurantInitial(restaurant.name)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-base font-bold text-ink">{restaurant.name}</span>
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <span>{restaurant.distanceMi ?? "—"} mi</span>
          <span>·</span>
          <span className="truncate">{restaurant.city}</span>
          {restaurant.priceTier && (
            <>
              <span>·</span>
              <PriceTier tier={restaurant.priceTier} />
            </>
          )}
        </div>
      </div>
      <StatusBadge status={restaurant.open ? "open" : "closed"} />
      <ChevronRight className="size-5 shrink-0 text-ink-soft" />
    </button>
  )
}
