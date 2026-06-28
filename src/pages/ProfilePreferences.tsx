import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { computeTargets } from "@/lib/tdee"
import { ProfileFieldsForm, type ProfileFieldsValue } from "@/components/profile/ProfileFieldsForm"
import { TotalDailyMacrosCard } from "@/components/profile/TotalDailyMacrosCard"

export function ProfilePreferences() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()

  function handleChange(patch: Partial<ProfileFieldsValue>) {
    const next = { ...profile, ...patch }
    const targets = computeTargets(next)
    updateProfile({ ...patch, ...targets })
  }

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
        <h1 className="text-2xl font-extrabold text-ink">Edit Preferences</h1>
      </div>

      <div className="px-5">
        <TotalDailyMacrosCard
          cal={profile.dailyCal}
          protein={profile.dailyProtein}
          carbs={profile.dailyCarbs}
          fat={profile.dailyFat}
        />
      </div>

      <div className="px-5">
        <ProfileFieldsForm value={profile} onChange={handleChange} />
      </div>
    </div>
  )
}
