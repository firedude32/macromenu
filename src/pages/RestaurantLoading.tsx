import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

// Placeholder — the real animated analysis screen is SPEC.md §3.5 / step 6.
// For now it just hands off to the restaurant page immediately.
export function RestaurantLoading() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(`/restaurant/${id}`, { replace: true })
  }, [id, navigate])

  return null
}
