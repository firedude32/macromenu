import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, X } from "lucide-react"
import { restaurants } from "@/data"
import { cn } from "@/lib/utils"
import { restaurantColor, restaurantInitial } from "@/components/restaurant/restaurantVisuals"

const DURATION_MS = 3000

const STEPS = [
  { label: "Locating Restaurant Menu", threshold: 25 },
  { label: "Analyzing Menu Items", threshold: 55 },
  { label: "Filtering for Your Goals", threshold: 85 },
  { label: "Personal Healthy Menu", threshold: 100 },
] as const

const DRIFT_CLASSES = [
  "animate-[drift-1_4s_ease-in-out_infinite]",
  "animate-[drift-2_4.5s_ease-in-out_infinite]",
  "animate-[drift-3_5s_ease-in-out_infinite]",
  "animate-[drift-4_4.2s_ease-in-out_infinite]",
]

const SCATTER_POSITIONS = [
  "left-[8%] top-2",
  "right-[10%] top-0",
  "left-[18%] top-16",
  "right-[14%] top-20",
]

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function RestaurantLoading() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [percent, setPercent] = useState(3)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number>(0)
  const advancedRef = useRef(false)

  const selected = restaurants.find((r) => r.id === id)
  const others = restaurants.filter((r) => r.id !== id).slice(0, 4)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      setPercent(100)
      return
    }

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / DURATION_MS, 1)
      const eased = easeOutCubic(t)
      setPercent(Math.max(3, Math.round(3 + eased * 97)))
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  useEffect(() => {
    if (percent >= 100 && !advancedRef.current) {
      advancedRef.current = true
      navigate(`/restaurant/${id}`, { replace: true })
    }
  }, [percent, id, navigate])

  if (!selected) return null

  return (
    <div className="relative flex h-full flex-col bg-app-bg px-6 pb-8 pt-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-frame-bg text-ink-soft"
        aria-label="Dismiss"
      >
        <X className="size-5" />
      </button>

      <div className="relative h-40 shrink-0">
        {others.map((r, i) => (
          <span
            key={r.id}
            className={cn(
              "absolute flex size-14 items-center justify-center rounded-tile text-base font-extrabold text-white opacity-70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] motion-reduce:animate-none",
              restaurantColor(r.id),
              SCATTER_POSITIONS[i],
              DRIFT_CLASSES[i],
            )}
            style={{ animationDelay: `${i * 220}ms` }}
          >
            {restaurantInitial(r.name)}
          </span>
        ))}
        <span
          className={cn(
            "absolute left-1/2 top-8 flex size-24 -translate-x-1/2 items-center justify-center rounded-tile text-3xl font-extrabold text-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
            restaurantColor(selected.id),
          )}
        >
          {restaurantInitial(selected.name)}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="text-7xl font-extrabold tabular-nums text-ink">{percent}%</div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-frame-bg">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-150 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="w-full rounded-card bg-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <ul className="flex flex-col gap-4">
            {STEPS.map((step) => {
              const done = percent >= step.threshold
              return (
                <li key={step.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      done ? "border-primary bg-primary" : "border-line bg-transparent",
                    )}
                  >
                    {done && <Check className="size-3 text-white" strokeWidth={3} />}
                  </span>
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      done ? "font-bold text-ink" : "text-ink-soft",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <button
        type="button"
        disabled={percent < 100}
        onClick={() => navigate(`/restaurant/${id}`, { replace: true })}
        className={cn(
          "w-full rounded-full py-4 text-center text-base font-bold transition-colors",
          percent >= 100 ? "bg-cta-black text-white" : "bg-frame-bg text-ink-soft",
        )}
      >
        Continue
      </button>
    </div>
  )
}
