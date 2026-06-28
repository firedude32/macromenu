import { useEffect, useState } from "react"
import { demoUser } from "@/data"

const STORAGE_KEY = "macromenu.favorites"

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore malformed/unavailable storage, fall back to the demo profile
  }
  return demoUser.favorites
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id],
    )
  }

  return { favorites, toggleFavorite }
}
