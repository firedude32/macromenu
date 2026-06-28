import { useNavigate } from "react-router-dom"
import { ChevronRight, FileText, Lock, ShieldCheck, User } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { TotalDailyMacrosCard } from "@/components/profile/TotalDailyMacrosCard"

const SETTINGS_ROWS = [
  { icon: User, label: "Edit Preferences", to: "/profile/preferences" },
  { icon: FileText, label: "Terms and Conditions", to: "/profile/terms" },
  { icon: Lock, label: "Privacy Policy", to: "/profile/privacy" },
  { icon: ShieldCheck, label: "Our Data & Accuracy", to: "/profile/data" },
]

const GOAL_LABEL: Record<string, string> = {
  cut: "Cut",
  maintain: "Maintain",
  bulk: "Bulk",
}

export function Profile() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const feet = Math.floor(profile.heightIn / 12)
  const inches = profile.heightIn % 12

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h1 className="px-5 pt-2 text-2xl font-extrabold text-ink">Settings</h1>

      <div className="flex flex-col items-center gap-2 px-5">
        <span className="flex size-20 items-center justify-center rounded-full bg-frame-bg">
          <User className="size-9 text-ink-soft" strokeWidth={1.5} />
        </span>
        <span className="text-lg font-extrabold text-ink">{profile.name}</span>
      </div>

      <button
        type="button"
        onClick={() => navigate("/profile/preferences")}
        className="mx-5 flex items-center justify-between rounded-card bg-card p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex gap-5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase text-ink-soft">Height</span>
            <span className="text-sm font-bold text-ink">
              {feet}'{inches}"
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase text-ink-soft">Weight</span>
            <span className="text-sm font-bold text-ink">{profile.weightLb.toFixed(1)} lbs</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase text-ink-soft">Goal</span>
            <span className="text-sm font-bold text-ink">{GOAL_LABEL[profile.goal]}</span>
          </div>
        </div>
        <ChevronRight className="size-5 shrink-0 text-ink-soft" />
      </button>

      <div className="mx-5">
        <TotalDailyMacrosCard
          cal={profile.dailyCal}
          protein={profile.dailyProtein}
          carbs={profile.dailyCarbs}
          fat={profile.dailyFat}
        />
      </div>

      <div className="mx-5 flex flex-col overflow-hidden rounded-card bg-card shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        {SETTINGS_ROWS.map(({ icon: Icon, label, to }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            className="flex items-center gap-3 px-4 py-3.5 text-left"
            style={i > 0 ? { borderTop: "1px solid var(--color-frame-bg)" } : undefined}
          >
            <Icon className="size-5 text-ink-soft" strokeWidth={1.75} />
            <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
            <ChevronRight className="size-4 text-ink-soft" />
          </button>
        ))}
      </div>
    </div>
  )
}
