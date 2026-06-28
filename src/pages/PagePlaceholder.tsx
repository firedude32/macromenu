export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
      <p className="text-sm text-ink-soft">Coming soon</p>
    </div>
  )
}
