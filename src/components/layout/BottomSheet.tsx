import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function BottomSheet({ open, onClose, children, className }: BottomSheetProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-card bg-card p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
