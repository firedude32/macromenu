import { useEffect, useState } from "react"
import { demoUser } from "@/data"
import type { UserProfile } from "@/data"

const STORAGE_KEY = "macromenu.profile"

function readProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...demoUser, ...JSON.parse(raw) }
  } catch {
    // ignore malformed/unavailable storage, fall back to the demo profile
  }
  return demoUser
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(readProfile)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  function updateProfile(patch: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...patch }))
  }

  return { profile, updateProfile }
}
