import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Square,
  Target,
  X,
} from "lucide-react"
import { restaurants, menuItems, combos, demoUser } from "@/data"
import { cn } from "@/lib/utils"
import { recommendationBuckets, whyThisPick } from "@/lib/recommend"
import { BottomSheet } from "@/components/layout/BottomSheet"
import { Pill } from "@/components/badges/Pill"
import { StatusBadge } from "@/components/badges/StatusBadge"
import { PriceTier } from "@/components/badges/PriceTier"
import { VerifiedBadge } from "@/components/badges/VerifiedBadge"
import { MacroDotStat } from "@/components/macro/MacroDotStat"
import { RecommendationCard } from "@/components/restaurant/RecommendationCard"
import { restaurantColor, restaurantInitial } from "@/components/restaurant/restaurantVisuals"
import { useFavorites } from "@/hooks/useFavorites"
import { PagePlaceholder } from "./PagePlaceholder"

type Mode = "best" | "all"

interface MenuRow {
  id: string
  name: string
  category: string
  cal: number
  protein: number
  carbs: number
  fat: number
  verified: boolean
  kind: "item" | "combo"
}

export function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useFavorites()

  const restaurant = restaurants.find((r) => r.id === id)

  const [mode, setMode] = useState<Mode>("best")
  const [sourceSheetOpen, setSourceSheetOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [openBuckets, setOpenBuckets] = useState<Set<string>>(new Set(["best"]))

  const rows: MenuRow[] = useMemo(() => {
    if (!restaurant) return []
    const itemRows: MenuRow[] = menuItems
      .filter((i) => i.restaurantId === restaurant.id)
      .map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        cal: i.cal,
        protein: i.protein,
        carbs: i.carbs,
        fat: i.fat,
        verified: i.verified,
        kind: "item",
      }))
    const comboRows: MenuRow[] = combos
      .filter((c) => c.restaurantId === restaurant.id)
      .map((c) => ({
        id: c.id,
        name: c.name,
        category: "Combos",
        cal: c.cal,
        protein: c.protein,
        carbs: c.carbs,
        fat: c.fat,
        verified: c.verified,
        kind: "combo",
      }))
    return [...itemRows, ...comboRows]
  }, [restaurant])

  const categories = useMemo(() => {
    const base = restaurant?.categories ?? []
    const present = new Set(rows.map((r) => r.category))
    const ordered = base.filter((c) => present.has(c))
    if (present.has("Combos") && !ordered.includes("Combos")) ordered.push("Combos")
    return ordered
  }, [restaurant, rows])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter(
      (r) =>
        (activeCategory === null || r.category === activeCategory) &&
        (query === "" || r.name.toLowerCase().includes(query)),
    )
  }, [rows, search, activeCategory])

  const buckets = useMemo(
    () => (restaurant ? recommendationBuckets(restaurant.id, demoUser) : []),
    [restaurant],
  )

  if (!restaurant) {
    return <PagePlaceholder title="Restaurant" />
  }

  const restaurantId = restaurant.id
  const isFavorite = favorites.includes(restaurantId)

  function toggleSelected(rowId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }

  function toggleExpanded(rowId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }

  function toggleBucket(key: string) {
    setOpenBuckets((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function openItemDetail(row: MenuRow) {
    if (row.kind === "item") {
      navigate(`/item/${restaurantId}/${row.id}`)
    }
  }

  const selectedRows = rows.filter((r) => selected.has(r.id))
  const tallyCal = selectedRows.reduce((sum, r) => sum + r.cal, 0)
  const tallyProtein = selectedRows.reduce((sum, r) => sum + r.protein, 0)

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 px-5 pt-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <ArrowLeft className="size-5 text-ink" />
          </button>
          <button
            type="button"
            onClick={() => setSourceSheetOpen(true)}
            aria-label="Data source"
            className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <AlertTriangle className="size-5 text-ink-soft" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "flex size-16 items-center justify-center rounded-tile text-2xl font-extrabold text-white",
              restaurantColor(restaurant.id),
            )}
          >
            {restaurantInitial(restaurant.name)}
          </span>
          <h1 className="text-2xl font-extrabold text-ink">{restaurant.name}</h1>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => toggleFavorite(restaurant.id)}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <Heart
              className="size-5"
              color="var(--color-danger)"
              fill={isFavorite ? "var(--color-danger)" : "none"}
            />
          </button>
          <button
            type="button"
            onClick={() => setMode("best")}
            aria-label="Best for you"
            className="flex size-9 items-center justify-center rounded-full bg-cta-black shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          >
            <Sparkles className="size-5 text-white" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-ink-soft">
          <StatusBadge status={restaurant.open ? "open" : "closed"} />
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            Your Area
          </span>
          {restaurant.priceTier && <PriceTier tier={restaurant.priceTier} />}
          <Target className="size-4 text-primary" aria-label="Tuned to your goal" />
        </div>

        <Pill
          options={[
            { value: "best", label: "Best for you", emoji: "🌍" },
            { value: "all", label: "All menu items", emoji: "🍔" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />
      </div>

      {mode === "all" ? (
        <div className="flex flex-col gap-4 px-5">
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <Search className="size-4 shrink-0 text-ink-soft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
            />
            {search !== "" && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                <X className="size-4 text-ink-soft" />
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto border-b border-frame-bg pb-2">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                "shrink-0 pb-1 text-sm font-semibold",
                activeCategory === null
                  ? "border-b-2 border-primary text-ink"
                  : "text-ink-soft",
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={cn(
                  "shrink-0 pb-1 text-sm font-semibold",
                  activeCategory === c
                    ? "border-b-2 border-primary text-ink"
                    : "text-ink-soft",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 pb-20">
            {filteredRows.map((row) => {
              const isSelected = selected.has(row.id)
              const isExpanded = expanded.has(row.id)
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 rounded-card bg-card p-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSelected(row.id)}
                      aria-label={isSelected ? "Remove from tally" : "Add to tally"}
                      className="shrink-0"
                    >
                      {isSelected ? (
                        <Check className="size-5 rounded bg-primary p-0.5 text-white" />
                      ) : (
                        <Square className="size-5 text-ink-soft" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openItemDetail(row)}
                      className="line-clamp-2 flex-1 text-left text-sm font-semibold text-ink"
                    >
                      {row.name}
                    </button>
                    <span className="flex items-center gap-1 text-sm font-bold text-cal">
                      <Flame className="size-4" />
                      {row.cal}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpanded(row.id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-ink-soft" />
                      ) : (
                        <ChevronDown className="size-4 text-ink-soft" />
                      )}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col gap-2 border-t border-frame-bg pt-3">
                      <div className="flex flex-wrap gap-3">
                        <MacroDotStat type="protein" label="Protein" value={`${row.protein}g`} />
                        <MacroDotStat type="carbs" label="Carbs" value={`${row.carbs}g`} />
                        <MacroDotStat type="fat" label="Fat" value={`${row.fat}g`} />
                      </div>
                      {row.verified && <VerifiedBadge />}
                    </div>
                  )}
                </div>
              )
            })}
            {filteredRows.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-soft">No items match.</p>
            )}
          </div>

          {selected.size > 0 && (
            <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[430px] items-center justify-between gap-3 bg-cta-black px-5 py-4 text-white">
              <span className="text-sm font-semibold">
                {selected.size} {selected.size === 1 ? "item" : "items"} · {tallyCal} cal ·{" "}
                {tallyProtein}g P
              </span>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-5 pb-6">
          {buckets.map((bucket) => {
            const isOpen = openBuckets.has(bucket.key)
            return (
              <div
                key={bucket.key}
                className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => toggleBucket(bucket.key)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-base font-extrabold text-ink">
                    <span>{bucket.emoji}</span>
                    {bucket.title}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="size-5 text-ink-soft" />
                  ) : (
                    <ChevronDown className="size-5 text-ink-soft" />
                  )}
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-3">
                    {bucket.items.map((pick) => (
                      <RecommendationCard
                        key={pick.id}
                        title={pick.name}
                        score={pick.score}
                        orderLine={pick.orderLine}
                        macros={pick}
                        whyText={whyThisPick(pick, demoUser)}
                        verified={pick.verified}
                        onTap={
                          pick.kind === "item"
                            ? () => navigate(`/item/${restaurant.id}/${pick.id}`)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {buckets.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-soft">
              No recommendations yet for this menu.
            </p>
          )}
        </div>
      )}

      {/* Data source sheet */}
      <BottomSheet open={sourceSheetOpen} onClose={() => setSourceSheetOpen(false)}>
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          <h3 className="text-lg font-extrabold text-ink">Verified data</h3>
          <p className="text-sm text-ink-soft">
            Every item here is verified against official {restaurant.name} nutrition data.
            {restaurant.auditedOn && ` Last audited ${restaurant.auditedOn}.`}
          </p>
          <button
            type="button"
            onClick={() => setSourceSheetOpen(false)}
            className="mt-2 w-full rounded-full bg-cta-black py-3 text-center text-sm font-bold text-white"
          >
            Got it
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
