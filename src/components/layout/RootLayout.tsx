import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PhoneFrame } from "./PhoneFrame"
import { StatusBar } from "./StatusBar"
import { BottomNav } from "./BottomNav"
import { hasOnboarded } from "@/hooks/useOnboarding"

const TAB_ROUTES = ["/", "/menu", "/profile"]

export function RootLayout() {
  const { pathname } = useLocation()
  const showNav = TAB_ROUTES.includes(pathname)

  if (pathname !== "/onboarding" && !hasOnboarded()) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 overflow-y-auto">
        {/* Keyed on the route so each screen / tab change fades in (SPEC §11). */}
        <div key={pathname} className="animate-in fade-in duration-200">
          <Outlet />
        </div>
      </div>
      {showNav && <BottomNav />}
    </PhoneFrame>
  )
}
