import { useState, type ReactNode } from "react"
import { ScoreBadge } from "@/components/macro/ScoreBadge"
import { MacroRow } from "@/components/macro/MacroRow"
import { MacroDotStat } from "@/components/macro/MacroDotStat"
import { MacroGrid } from "@/components/macro/MacroGrid"
import { WhyThisPick } from "@/components/macro/WhyThisPick"
import { Pill } from "@/components/badges/Pill"
import { StatusBadge } from "@/components/badges/StatusBadge"
import { PriceTier } from "@/components/badges/PriceTier"
import { VerifiedBadge } from "@/components/badges/VerifiedBadge"

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</h2>
      <div className="flex flex-col gap-3 rounded-card bg-card p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        {children}
      </div>
    </section>
  )
}

export function Gallery() {
  const [mode, setMode] = useState("best")

  return (
    <div className="flex flex-col gap-6 px-5 py-6">
      <h1 className="text-2xl font-extrabold text-ink">Component Gallery</h1>

      <Section title="ScoreBadge">
        <div className="flex items-end justify-around">
          <ScoreBadge value={96} />
          <ScoreBadge value={84} />
          <ScoreBadge value={72} />
          <ScoreBadge value={60} />
          <ScoreBadge value={40} />
        </div>
      </Section>

      <Section title="MacroRow">
        <MacroRow cal={400} protein={34} carbs={26} fat={18} />
        <MacroRow cal={675} protein={52} carbs={72} fat={22} />
      </Section>

      <Section title="MacroDotStat">
        <MacroDotStat type="protein" label="Protein" value="49g" />
        <MacroDotStat type="carbs" label="Carbs" value="35g" />
        <MacroDotStat type="fat" label="Fat" value="16g" />
      </Section>

      <Section title="MacroGrid">
        <MacroGrid cal={540} protein={74} carbs={32} fat={16} />
      </Section>

      <Section title="WhyThisPick">
        <WhyThisPick>
          74g of protein while staying under your calorie ceiling — ideal for cut.
        </WhyThisPick>
        <WhyThisPick>
          Only 130 cal with 8g protein — a lean, high-value pick.
        </WhyThisPick>
      </Section>

      <Section title="Pill">
        <Pill
          value={mode}
          onChange={setMode}
          options={[
            { value: "best", label: "Best for you", emoji: "🌍" },
            { value: "all", label: "All menu items", emoji: "🍔" },
          ]}
        />
      </Section>

      <Section title="StatusBadge">
        <div className="flex gap-3">
          <StatusBadge status="open" />
          <StatusBadge status="closed" />
        </div>
      </Section>

      <Section title="PriceTier">
        <div className="flex gap-4">
          <PriceTier tier={1} />
          <PriceTier tier={2} />
          <PriceTier tier={3} />
        </div>
      </Section>

      <Section title="VerifiedBadge">
        <VerifiedBadge />
      </Section>
    </div>
  )
}
