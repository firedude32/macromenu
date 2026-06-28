import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function ProfilePrivacy() {
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
        <h1 className="text-2xl font-extrabold text-ink">Privacy Policy</h1>
      </div>
      <p className="px-5 text-sm leading-relaxed text-ink-soft">
        Your profile, preferences, and favorites are stored locally on your device and are never
        sent to an external server or used to train AI models. MacroMenu does not collect or sell
        personal data.
      </p>
    </div>
  )
}
