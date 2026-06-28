import { Sparkles } from "lucide-react"

export function WhyThisPick({ children }: { children: string }) {
  return (
    <div className="overflow-hidden rounded-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      <div
        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
        style={{
          background:
            "linear-gradient(to right, var(--color-insight-from), var(--color-insight-to))",
        }}
      >
        <Sparkles className="size-3.5" />
        Why this pick
      </div>
      <div className="bg-card px-4 py-3 text-sm text-ink">{children}</div>
    </div>
  )
}
