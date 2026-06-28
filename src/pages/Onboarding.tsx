import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { demoUser } from "@/data"
import type { UserProfile } from "@/data"
import { computeTargets, type MacroTargets } from "@/lib/tdee"
import { useProfile } from "@/hooks/useProfile"
import { markOnboarded } from "@/hooks/useOnboarding"
import { ProfileFieldsForm, type ProfileFieldsValue } from "@/components/profile/ProfileFieldsForm"
import { TotalDailyMacrosCard } from "@/components/profile/TotalDailyMacrosCard"
import { MoodChip } from "@/components/restaurant/MoodChip"
import { cn } from "@/lib/utils"

const CRAVINGS = [
  { value: "chicken", emoji: "🍗", label: "Chicken" },
  { value: "seafood", emoji: "🐟", label: "Seafood" },
  { value: "lamb", emoji: "🍖", label: "Lamb" },
  { value: "beef", emoji: "🥩", label: "Beef" },
  { value: "pork", emoji: "🍖", label: "Pork" },
  { value: "tofu", emoji: "🍲", label: "Tofu" },
  { value: "turkey", emoji: "🦃", label: "Turkey" },
] as const

const STEPS = ["welcome", "goal", "stats", "targets", "cravings", "done"] as const
type Step = (typeof STEPS)[number]

export function Onboarding() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useProfile()
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState<UserProfile>(profile)
  const step: Step = STEPS[stepIndex]

  function handleStatsChange(patch: Partial<ProfileFieldsValue>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      return { ...next, ...computeTargets(next) }
    })
  }

  function handleTargetsChange(patch: Partial<MacroTargets>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function toggleCraving(value: string) {
    setDraft((prev) => ({
      ...prev,
      cravings: prev.cravings.includes(value)
        ? prev.cravings.filter((c) => c !== value)
        : [...prev.cravings, value],
    }))
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function finish() {
    updateProfile(draft)
    markOnboarded()
    navigate("/")
  }

  function skipToDemo() {
    updateProfile(demoUser)
    markOnboarded()
    navigate("/")
  }

  return (
    <div className="flex h-full flex-col px-6 py-8">
      {step !== "welcome" && step !== "done" && (
        <div className="mb-6 flex justify-center gap-1.5">
          {STEPS.slice(1, -1).map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 w-6 rounded-full",
                STEPS.indexOf(s) <= stepIndex ? "bg-primary" : "bg-frame-bg",
              )}
            />
          ))}
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {step === "welcome" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h1 className="text-3xl font-extrabold text-ink">MacroMenu</h1>
            <p className="text-lg font-bold text-ink">The macros are actually right.</p>
            <p className="text-sm text-ink-soft">
              Every number audited against official restaurant data.
            </p>
          </div>
        )}

        {step === "goal" && (
          <div className="flex flex-1 flex-col gap-6">
            <h1 className="text-2xl font-extrabold text-ink">What's your goal?</h1>
            <ProfileFieldsForm value={draft} onChange={handleStatsChange} showStats={false} />
          </div>
        )}

        {step === "stats" && (
          <div className="flex flex-1 flex-col gap-6">
            <h1 className="text-2xl font-extrabold text-ink">Tell us about you</h1>
            <ProfileFieldsForm value={draft} onChange={handleStatsChange} showGoal={false} />
          </div>
        )}

        {step === "targets" && (
          <div className="flex flex-1 flex-col gap-6">
            <h1 className="text-2xl font-extrabold text-ink">Your daily targets</h1>
            <TotalDailyMacrosCard
              cal={draft.dailyCal}
              protein={draft.dailyProtein}
              carbs={draft.dailyCarbs}
              fat={draft.dailyFat}
            />
            <p className="text-xs font-semibold uppercase text-ink-soft">Fine-tune (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <TargetField
                label="Calories"
                value={draft.dailyCal}
                onChange={(v) => handleTargetsChange({ dailyCal: v })}
              />
              <TargetField
                label="Protein (g)"
                value={draft.dailyProtein}
                onChange={(v) => handleTargetsChange({ dailyProtein: v })}
              />
              <TargetField
                label="Carbs (g)"
                value={draft.dailyCarbs}
                onChange={(v) => handleTargetsChange({ dailyCarbs: v })}
              />
              <TargetField
                label="Fat (g)"
                value={draft.dailyFat}
                onChange={(v) => handleTargetsChange({ dailyFat: v })}
              />
            </div>
          </div>
        )}

        {step === "cravings" && (
          <div className="flex flex-1 flex-col gap-6">
            <h1 className="text-2xl font-extrabold text-ink">Any cravings?</h1>
            <p className="text-sm text-ink-soft">Optional — helps us surface picks you'll like.</p>
            <div className="flex flex-wrap gap-2">
              {CRAVINGS.map((c) => (
                <MoodChip
                  key={c.value}
                  emoji={c.emoji}
                  label={c.label}
                  selected={draft.cravings.includes(c.value)}
                  onClick={() => toggleCraving(c.value)}
                />
              ))}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h1 className="text-2xl font-extrabold text-ink">You're all set</h1>
            <p className="text-sm text-ink-soft">Your targets are ready. Let's find your best picks.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={step === "done" ? finish : goNext}
          className="rounded-full bg-cta-black py-3.5 text-center text-base font-bold text-white transition-transform active:scale-[0.98]"
        >
          {step === "done" ? "Get started" : "Continue"}
        </button>
        {step === "welcome" ? (
          <button
            type="button"
            onClick={skipToDemo}
            className="text-center text-sm font-semibold text-ink-soft"
          >
            Skip — use demo profile
          </button>
        ) : (
          step !== "done" && (
            <button
              type="button"
              onClick={goBack}
              className="text-center text-sm font-semibold text-ink-soft"
            >
              Back
            </button>
          )
        )}
      </div>
    </div>
  )
}

function TargetField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase text-ink-soft">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        className="w-full rounded-tile bg-frame-bg px-3 py-2.5 text-sm font-semibold text-ink outline-none"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
