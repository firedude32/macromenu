import { NavLink } from "react-router-dom"
import { Home, Menu as MenuIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/menu", label: "Menu", icon: MenuIcon, end: false },
  { to: "/profile", label: "Profile", icon: User, end: false },
] as const

export function BottomNav() {
  return (
    <nav className="flex shrink-0 items-center justify-around border-t border-ink-soft/15 bg-white/80 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] backdrop-blur-md">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center gap-1"
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full transition-transform active:scale-90",
                  isActive && "bg-primary",
                )}
              >
                <Icon
                  className="size-5"
                  strokeWidth={isActive ? 2.25 : 1.5}
                  color={isActive ? "var(--color-card)" : "var(--color-line)"}
                />
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  isActive ? "text-ink" : "text-ink-soft",
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
