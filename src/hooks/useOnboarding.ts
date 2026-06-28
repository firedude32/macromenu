const STORAGE_KEY = "macromenu.hasOnboarded"

export function hasOnboarded(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true"
}

export function markOnboarded(): void {
  localStorage.setItem(STORAGE_KEY, "true")
}
