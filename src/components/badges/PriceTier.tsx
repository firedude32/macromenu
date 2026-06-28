import { Banknote } from "lucide-react"

export function PriceTier({ tier }: { tier: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
      <Banknote className="size-3.5" />
      {"$".repeat(tier)}
    </span>
  )
}
