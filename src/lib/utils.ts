import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "3120" -> "3.1K", "850" -> "850" — used for the big calorie ring. */
export function formatCalories(cal: number): string {
  if (cal >= 1000) return `${(cal / 1000).toFixed(1)}K`
  return `${Math.round(cal)}`
}
