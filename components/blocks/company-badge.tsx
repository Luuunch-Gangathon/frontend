import Link from "next/link"
import { cn } from "@/lib/utils"

interface CompanyBadgeProps {
  id: number
  name: string
  className?: string
}

export function CompanyBadge({ id, name, className }: CompanyBadgeProps) {
  return (
    <Link
      href={`/companies/${id}`}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80 transition-colors",
        className
      )}
    >
      {name}
    </Link>
  )
}
