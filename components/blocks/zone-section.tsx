import React from "react"
import { cn } from "@/lib/utils"

interface ZoneSectionProps {
  zone: 1 | 2 | 3
  title: string
  children: React.ReactNode
  className?: string
}

const ZONE_LABELS = {
  1: "What it is",
  2: "What it connects to",
  3: "What to do about it",
}

export function ZoneSection({ zone, title, children, className }: ZoneSectionProps) {
  return (
    <section className={cn("mt-8", className)}>
      <div className="mb-4 flex items-center gap-3">
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
          Zone {zone} — {ZONE_LABELS[zone]}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}
