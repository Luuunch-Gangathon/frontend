import { cn } from "@/lib/utils"
import type { EvidenceItem } from "@/lib/types"

interface EvidenceTrailProps {
  items: EvidenceItem[]
  className?: string
}

const confidenceConfig = {
  high:   { dot: 'bg-emerald-500', label: 'High confidence' },
  medium: { dot: 'bg-amber-400',   label: 'Medium confidence' },
  low:    { dot: 'bg-red-400',     label: 'Low confidence' },
}

const sourceTypeConfig = {
  internal:  { text: 'Internal',  cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  supplier:  { text: 'Supplier',  cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  regulator: { text: 'Regulator', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  industry:  { text: 'Industry',  cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
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
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                    {item.source}
                  </a>
                ) : (
                  item.source
                )}
              </p>
              {item.confidence && (
                <span
                  title={confidenceConfig[item.confidence].label}
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <span className={cn("h-2 w-2 rounded-full", confidenceConfig[item.confidence].dot)} />
                  {item.confidence}
                </span>
              )}
              {item.source_type && (
                <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", sourceTypeConfig[item.source_type].cls)}>
                  {sourceTypeConfig[item.source_type].text}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
