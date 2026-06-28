import { Routes, Route } from "react-router-dom"
import { RootLayout } from "@/components/layout/RootLayout"
import { Onboarding } from "@/pages/Onboarding"
import { Home } from "@/pages/Home"
import { RestaurantLoading } from "@/pages/RestaurantLoading"
import { RestaurantDetail } from "@/pages/RestaurantDetail"
import { ItemDetail } from "@/pages/ItemDetail"
import { Menu } from "@/pages/Menu"
import { Profile } from "@/pages/Profile"
import { ProfilePreferences } from "@/pages/ProfilePreferences"
import { ProfileData } from "@/pages/ProfileData"
import { ProfileTerms } from "@/pages/ProfileTerms"
import { ProfilePrivacy } from "@/pages/ProfilePrivacy"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id/loading" element={<RestaurantLoading />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/item/:restaurantId/:itemId" element={<ItemDetail />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/preferences" element={<ProfilePreferences />} />
        <Route path="/profile/data" element={<ProfileData />} />
        <Route path="/profile/terms" element={<ProfileTerms />} />
        <Route path="/profile/privacy" element={<ProfilePrivacy />} />
      </Route>
    </Routes>
  )
}

export default App
