import type { Restaurant } from "@/data"
import { cn } from "@/lib/utils"
import { restaurantColor, restaurantInitial } from "./restaurantVisuals"

interface RestaurantLogoCardProps {
  restaurant: Restaurant
  onTap: (restaurant: Restaurant) => void
}

export function RestaurantLogoCard({ restaurant, onTap }: RestaurantLogoCardProps) {
  return (
    <button
      type="button"
      onClick={() => onTap(restaurant)}
      className="flex w-20 shrink-0 flex-col items-center gap-2"
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-tile text-xl font-extrabold text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
          restaurantColor(restaurant.id),
        )}
      >
        {restaurantInitial(restaurant.name)}
      </span>
      <span className="line-clamp-2 text-center text-xs font-semibold leading-tight text-ink">
        {restaurant.name}
      </span>
    </button>
  )
}
