"use client"
import { useRouter } from "next/navigation"
import { useCompare } from "@/lib/compare-context"

export function CompareFloat() {
  const { selected, clear } = useCompare()
  const router = useRouter()

  if (selected.length < 2) return null

  const handleCompare = () => {
    router.push(`/compare?ids=${selected.join(",")}`)
    clear()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-foreground px-5 py-3 shadow-xl text-background">
      <span className="text-sm font-medium">
        Compare ({selected.length})
      </span>
      <button
        onClick={handleCompare}
        className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        View comparison →
      </button>
      <button
        onClick={clear}
        className="text-xs text-background/60 hover:text-background transition-colors"
        aria-label="Clear selection"
      >
        ✕
      </button>
    </div>
  )
}
