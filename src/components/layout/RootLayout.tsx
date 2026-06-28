import { Outlet, useLocation } from "react-router-dom"
import { PhoneFrame } from "./PhoneFrame"
import { StatusBar } from "./StatusBar"
import { BottomNav } from "./BottomNav"

const TAB_ROUTES = ["/", "/menu", "/profile"]

export function RootLayout() {
  const { pathname } = useLocation()
  const showNav = TAB_ROUTES.includes(pathname)

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {showNav && <BottomNav />}
    </PhoneFrame>
  )
}
