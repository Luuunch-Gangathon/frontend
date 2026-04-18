import Link from "next/link"
import { cn } from "@/lib/utils"

interface PitchAction {
  label: string
  href: string
  variant?: "primary" | "secondary"
}

interface PitchCardProps {
  headline: string
  bullets: string[]
  actions: PitchAction[]
  className?: string
}

export function PitchCard({ headline, bullets, actions, className }: PitchCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <h3 className="text-base font-semibold">{headline}</h3>
      <ul className="mt-3 space-y-1.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-primary" />
            {bullet}
          </li>
        ))}
      </ul>
      {actions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                action.variant === "secondary"
                  ? "border border-border bg-background hover:bg-muted"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
