import { cn } from "@/lib/utils"

interface StatTile {
  label: string
  value: string | number
}

interface StatsStripProps {
  stats: StatTile[]
  className?: string
}

export function StatsStrip({ stats, className }: StatsStripProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-card px-4 py-3"
        >
          <div className="text-2xl font-semibold tabular-nums">{stat.value}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
