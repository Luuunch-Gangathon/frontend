import { cn } from "@/lib/utils"

type ComplianceStatus = "pass" | "warn" | "fail"

interface ComplianceBadgeProps {
  tag: string
  status?: ComplianceStatus
  className?: string
}

const STATUS_STYLES: Record<ComplianceStatus, string> = {
  pass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  fail: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export function ComplianceBadge({ tag, status = "pass", className }: ComplianceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {tag}
    </span>
  )
}
