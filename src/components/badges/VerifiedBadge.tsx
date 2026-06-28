import { BadgeCheck } from "lucide-react"

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
      <BadgeCheck className="size-4" />
      Verified
    </span>
  )
}
