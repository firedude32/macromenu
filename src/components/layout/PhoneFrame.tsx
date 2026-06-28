import type { ReactNode } from "react"

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-frame-bg max-[480px]:min-h-0">
      <div
        className={[
          "relative flex h-[100dvh] w-full flex-col overflow-hidden bg-app-bg",
          "max-w-[430px] rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] ring-[10px] ring-black/90",
          "max-[480px]:max-w-full max-[480px]:rounded-none max-[480px]:shadow-none max-[480px]:ring-0",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  )
}
