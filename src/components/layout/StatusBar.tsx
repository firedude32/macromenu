import { SignalHigh, Wifi, BatteryFull } from "lucide-react"

export function StatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between px-6 pt-3 pb-1 text-ink">
      <span className="text-[15px] font-semibold tabular-nums">10:51</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh className="size-4" strokeWidth={2.5} />
        <span className="text-[11px] font-semibold">5G</span>
        <Wifi className="size-4" strokeWidth={2.5} />
        <BatteryFull className="size-5" strokeWidth={2} />
      </div>
    </div>
  )
}
