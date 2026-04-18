import { cn } from "@/lib/utils"
import type { ComplianceRequirement } from "@/lib/types"

interface ComplianceChecklistProps {
  items: ComplianceRequirement[]
  className?: string
}

const statusConfig = {
  met:     { icon: '✓', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  gap:     { icon: '⚠', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  partial: { icon: '◐', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
}

export function ComplianceChecklist({ items, className }: ComplianceChecklistProps) {
  if (!items.length) return null
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((req, i) => {
        const cfg = statusConfig[req.status]
        return (
          <div
            key={i}
            title={req.note ?? undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium cursor-default select-none",
              cfg.cls
            )}
          >
            <span aria-hidden>{cfg.icon}</span>
            <span>{req.label}</span>
            {req.note && <span className="opacity-60 text-[10px]">ⓘ</span>}
          </div>
        )
      })}
    </div>
  )
}
