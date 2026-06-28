// Deterministic placeholder visuals for restaurants — no logo/photo assets
// exist yet, so each restaurant gets a stable color + initial derived from
// its id (not random, so it doesn't flicker on re-render).

const PALETTE = [
  "bg-primary",
  "bg-protein",
  "bg-carbs",
  "bg-fat",
  "bg-insight-from",
  "bg-cta-black",
] as const

export function restaurantColor(id: string): string {
  const hash = id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

export function restaurantInitial(name: string): string {
  return name.replace(/[^A-Za-z0-9]/, "").charAt(0).toUpperCase()
}
