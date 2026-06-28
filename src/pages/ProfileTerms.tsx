import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function ProfileTerms() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-center gap-3 px-5 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <ArrowLeft className="size-5 text-ink" />
        </button>
        <h1 className="text-2xl font-extrabold text-ink">Terms and Conditions</h1>
      </div>
      <p className="px-5 text-sm leading-relaxed text-ink-soft">
        MacroMenu provides nutrition information for informational purposes only. Menu items,
        prices, and availability vary by location and are subject to change by each restaurant.
        By using this app you agree not to rely on it for medical or dietary decisions without
        consulting a qualified professional.
      </p>
    </div>
  )
}
