import type { ReactNode } from "react"
import type { ActivityLevel, Goal, Sex } from "@/data"
import { Pill } from "@/components/badges/Pill"
import { cn } from "@/lib/utils"

export interface ProfileFieldsValue {
  heightIn: number
  weightLb: number
  age: number
  sex: Sex
  activity: ActivityLevel
  goal: Goal
}

interface ProfileFieldsFormProps {
  value: ProfileFieldsValue
  onChange: (patch: Partial<ProfileFieldsValue>) => void
}

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light" },
  { value: "moderate", label: "Moderate" },
  { value: "active", label: "Active" },
  { value: "veryActive", label: "Very active" },
]

const GOAL_OPTIONS = [
  { value: "cut", label: "Cut" },
  { value: "maintain", label: "Maintain" },
  { value: "bulk", label: "Bulk" },
]

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase text-ink-soft">{label}</span>
      {children}
    </div>
  )
}

const inputClass =
  "w-full rounded-tile bg-frame-bg px-3 py-2.5 text-sm font-semibold text-ink outline-none"

/** Goal + body-stat fields shared by Edit Preferences (§5.8) and Onboarding. */
export function ProfileFieldsForm({ value, onChange }: ProfileFieldsFormProps) {
  const feet = Math.floor(value.heightIn / 12)
  const inches = value.heightIn % 12

  return (
    <div className="flex flex-col gap-4">
      <Field label="Goal">
        <Pill options={GOAL_OPTIONS} value={value.goal} onChange={(goal) => onChange({ goal: goal as Goal })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Height">
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              aria-label="Height (feet)"
              className={inputClass}
              value={feet}
              onChange={(e) => onChange({ heightIn: Number(e.target.value) * 12 + inches })}
            />
            <input
              type="number"
              inputMode="numeric"
              aria-label="Height (inches)"
              className={inputClass}
              value={inches}
              onChange={(e) => onChange({ heightIn: feet * 12 + Number(e.target.value) })}
            />
          </div>
        </Field>
        <Field label="Weight (lb)">
          <input
            type="number"
            inputMode="numeric"
            className={inputClass}
            value={value.weightLb}
            onChange={(e) => onChange({ weightLb: Number(e.target.value) })}
          />
        </Field>
      </div>

      <Field label="Age">
        <input
          type="number"
          inputMode="numeric"
          className={inputClass}
          value={value.age}
          onChange={(e) => onChange({ age: Number(e.target.value) })}
        />
      </Field>

      <Field label="Sex">
        <Pill options={SEX_OPTIONS} value={value.sex} onChange={(sex) => onChange({ sex: sex as Sex })} />
      </Field>

      <Field label="Activity level">
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_OPTIONS.map((opt) => {
            const selected = opt.value === value.activity
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ activity: opt.value as ActivityLevel })}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  selected ? "bg-cta-black text-white" : "bg-frame-bg text-ink-soft",
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </Field>
    </div>
  )
}
