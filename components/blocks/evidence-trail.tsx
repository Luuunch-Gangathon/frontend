import { cn } from "@/lib/utils"
import type { EvidenceItem } from "@/lib/demo-data"

interface EvidenceTrailProps {
  items: EvidenceItem[]
  className?: string
}

export function EvidenceTrail({ items, className }: EvidenceTrailProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {i + 1}
          </span>
          <div className="text-sm">
            <p className="text-foreground">{item.claim}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  {item.source}
                </a>
              ) : (
                item.source
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
