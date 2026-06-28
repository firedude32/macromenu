import { useMemo, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"
import { restaurants, type Restaurant } from "@/data"
import { useFavorites } from "@/hooks/useFavorites"
import { cn } from "@/lib/utils"
import { BottomSheet } from "@/components/layout/BottomSheet"
import { RestaurantLogoCard } from "@/components/restaurant/RestaurantLogoCard"
import { RestaurantCard } from "@/components/restaurant/RestaurantCard"
import { RestaurantListRow } from "@/components/restaurant/RestaurantListRow"
import { MoodChip } from "@/components/restaurant/MoodChip"

const MOODS = [
  { value: "chicken", emoji: "🍗", label: "Chicken" },
  { value: "seafood", emoji: "🐟", label: "Seafood" },
  { value: "lamb", emoji: "🍖", label: "Lamb" },
  { value: "beef", emoji: "🥩", label: "Beef" },
  { value: "pork", emoji: "🍖", label: "Pork" },
  { value: "tofu", emoji: "🍲", label: "Tofu" },
  { value: "turkey", emoji: "🦃", label: "Turkey" },
] as const

// Header-only — selecting a city just swaps the label per SPEC.md §5.2, it
// doesn't refilter the (single-city) seed data.
const CITY_OPTIONS = ["Clear Lake, IA", "Mason City, IA", "Forest City, IA"]

type SortBy = "distance" | "name"

interface Filters {
  openNow: boolean
  verifiedOnly: boolean
  sortBy: SortBy
}

const DEFAULT_FILTERS: Filters = { openNow: false, verifiedOnly: false, sortBy: "distance" }

function applyFilters(list: Restaurant[], filters: Filters): Restaurant[] {
  return [...list]
    .filter((r) => !filters.openNow || r.open)
    .filter((r) => !filters.verifiedOnly || r.status === "verified")
    .sort((a, b) => {
      if (filters.sortBy === "name") return a.name.localeCompare(b.name)
      return (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity)
    })
}

export function Home() {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useFavorites()

  const [city, setCity] = useState(CITY_OPTIONS[0])
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [auditPendingRestaurant, setAuditPendingRestaurant] = useState<Restaurant | null>(null)

  const [search, setSearch] = useState("")
  const [mood, setMood] = useState<string | null>(null)

  function handleTap(restaurant: Restaurant) {
    if (restaurant.status === "verified") {
      navigate(`/restaurant/${restaurant.id}/loading`)
    } else {
      setAuditPendingRestaurant(restaurant)
    }
  }

  const filteredAll = useMemo(() => applyFilters(restaurants, filters), [filters])

  const isSearching = search.trim() !== "" || mood !== null
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase()
    return filteredAll.filter(
      (r) =>
        (query === "" || r.name.toLowerCase().includes(query)) &&
        (mood === null || r.cuisine?.includes(mood)),
    )
  }, [filteredAll, search, mood])

  const fastFood = filteredAll
  const nearMe = useMemo(
    () => [...filteredAll].sort((a, b) => (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity)),
    [filteredAll],
  )
  const favoriteRestaurants = useMemo(
    () => filteredAll.filter((r) => favorites.includes(r.id)),
    [filteredAll, favorites],
  )
  const mostPopular = useMemo(
    () => [...filteredAll].sort((a, b) => (b.favoriteCount ?? 0) - (a.favoriteCount ?? 0)),
    [filteredAll],
  )

  return (
    <div className="flex flex-col gap-6 px-5 py-6">
      {/* Location + filter */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCityPickerOpen(true)}
          className="flex flex-col items-start gap-0.5"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Location
          </span>
          <span className="flex items-center gap-1 text-lg font-extrabold text-ink">
            {city}
            <ChevronDown className="size-4 text-ink-soft" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => setFilterSheetOpen(true)}
          aria-label="Filters"
          className="flex size-10 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <SlidersHorizontal className="size-5 text-protein" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <Search className="size-4 shrink-0 text-ink-soft" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants"
          className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
        />
        {search !== "" && (
          <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
            <X className="size-4 text-ink-soft" />
          </button>
        )}
      </div>

      {/* Mood chips — stay visible in both modes so a selected mood can be cleared */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-extrabold text-ink">What are you in the mood for?</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MOODS.map((m) => (
            <MoodChip
              key={m.value}
              emoji={m.emoji}
              label={m.label}
              selected={mood === m.value}
              onClick={() => setMood((prev) => (prev === m.value ? null : m.value))}
            />
          ))}
        </div>
      </div>

      {isSearching ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-ink-soft">
            {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
          </h2>
          <div className="flex flex-col gap-3">
            {searchResults.map((r) => (
              <RestaurantListRow key={r.id} restaurant={r} onTap={handleTap} />
            ))}
            {searchResults.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-soft">No restaurants match.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <Row title="Fast Food Restaurants">
            <div className="flex gap-4 overflow-x-auto pb-1">
              {fastFood.map((r) => (
                <RestaurantLogoCard key={r.id} restaurant={r} onTap={handleTap} />
              ))}
            </div>
          </Row>

          <Row title="Near Me">
            <div className="flex gap-4 overflow-x-auto pb-1">
              {nearMe.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onTap={handleTap}
                  isFavorite={favorites.includes(r.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </Row>

          <Row title="Favorite Restaurants">
            {favoriteRestaurants.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Tap the heart on a restaurant to add it here.
              </p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-1">
                {favoriteRestaurants.map((r) => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    onTap={handleTap}
                    isFavorite
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </Row>

          <Row title="Most Popular">
            <div className="flex gap-4 overflow-x-auto pb-1">
              {mostPopular.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onTap={handleTap}
                  isFavorite={favorites.includes(r.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </Row>
        </>
      )}

      {/* City picker sheet */}
      <BottomSheet open={cityPickerOpen} onClose={() => setCityPickerOpen(false)}>
        <h3 className="mb-4 text-lg font-extrabold text-ink">Choose a city</h3>
        <div className="flex flex-col gap-1">
          {CITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setCity(option)
                setCityPickerOpen(false)
              }}
              className={cn(
                "rounded-tile px-4 py-3 text-left text-base font-semibold",
                option === city ? "bg-primary/10 text-primary" : "text-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Filter sheet */}
      <BottomSheet open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)}>
        <h3 className="mb-4 text-lg font-extrabold text-ink">Filters</h3>
        <div className="flex flex-col gap-4">
          <ToggleRow
            label="Open now"
            checked={filters.openNow}
            onChange={(v) => setFilters((f) => ({ ...f, openNow: v }))}
          />
          <ToggleRow
            label="Verified only"
            checked={filters.verifiedOnly}
            onChange={(v) => setFilters((f) => ({ ...f, verifiedOnly: v }))}
          />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">Sort by</span>
            <div className="flex gap-2">
              {(["distance", "name"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, sortBy: opt }))}
                  className={cn(
                    "flex-1 rounded-full px-3 py-2 text-sm font-semibold capitalize",
                    filters.sortBy === opt ? "bg-primary text-white" : "bg-frame-bg text-ink-soft",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterSheetOpen(false)}
            className="mt-2 rounded-full bg-cta-black py-3 text-center text-sm font-bold text-white"
          >
            Done
          </button>
        </div>
      </BottomSheet>

      {/* Audit-pending sheet */}
      <BottomSheet
        open={auditPendingRestaurant !== null}
        onClose={() => setAuditPendingRestaurant(null)}
      >
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <h3 className="text-lg font-extrabold text-ink">Audit in progress</h3>
          <p className="text-sm text-ink-soft">
            We're still hand-auditing {auditPendingRestaurant?.name}'s menu against its official
            nutrition data. We only publish a menu once every item is verified — check back soon.
          </p>
          <button
            type="button"
            onClick={() => setAuditPendingRestaurant(null)}
            className="mt-2 w-full rounded-full bg-cta-black py-3 text-center text-sm font-bold text-white"
          >
            Got it
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      {children}
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between"
    >
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full px-0.5 transition-colors",
          checked ? "justify-end bg-primary" : "justify-start bg-frame-bg",
        )}
      >
        <span className="size-5 rounded-full bg-white shadow" />
      </span>
    </button>
  )
}
