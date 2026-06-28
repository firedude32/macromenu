import { useNavigate } from "react-router-dom"
import { ArrowLeft, BadgeCheck, Clock, Flag } from "lucide-react"
import { restaurants } from "@/data"

export function ProfileData() {
  const navigate = useNavigate()
  const verified = restaurants.filter((r) => r.status === "verified")
  const pending = restaurants.filter((r) => r.status === "auditPending")

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex items-center gap-3 px-5 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <ArrowLeft className="size-5 text-ink" />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5">
        <h1 className="text-2xl font-extrabold text-ink">Every number is verified.</h1>
        <p className="text-sm text-ink-soft">
          We audit each menu item against the restaurant's official published nutrition data, by
          hand, and re-check on a schedule — we don't guess with AI. That's why we cover fewer
          restaurants: quality over quantity.
        </p>
      </div>

      <div className="flex flex-col gap-3 px-5">
        <h2 className="text-base font-extrabold text-ink">Verified restaurants</h2>
        <div className="flex flex-col overflow-hidden rounded-card bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {verified.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={i > 0 ? { borderTop: "1px solid var(--color-frame-bg)" } : undefined}
            >
              <BadgeCheck className="size-5 shrink-0 text-primary" />
              <span className="flex-1 text-sm font-semibold text-ink">{r.name}</span>
              {r.auditedOn && <span className="text-xs text-ink-soft">Audited {r.auditedOn}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5">
        <h2 className="text-base font-extrabold text-ink">Coming soon (audit in progress)</h2>
        <div className="flex flex-col overflow-hidden rounded-card bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          {pending.map((r, i) => (
            <div
              key={r.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={i > 0 ? { borderTop: "1px solid var(--color-frame-bg)" } : undefined}
            >
              <Clock className="size-5 shrink-0 text-ink-soft" />
              <span className="flex-1 text-sm font-semibold text-ink">{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 px-5 text-sm text-ink-soft">
        <Flag className="mt-0.5 size-4 shrink-0" />
        <p>
          Spot something off? Report a discrepancy from any item's detail page and our team will
          re-verify it against the restaurant's official source.
        </p>
      </div>
    </div>
  )
}
