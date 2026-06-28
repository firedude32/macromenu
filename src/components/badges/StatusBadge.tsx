import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: "open" | "closed" }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-bold text-white",
        status === "open" ? "bg-primary" : "bg-danger",
      )}
    >
      {status === "open" ? "Open" : "Closed"}
    </span>
  )
}
