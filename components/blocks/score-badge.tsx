import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  className?: string
}

function getLevel(score: number): { label: string; cls: string } {
  if (score >= 70) return { label: "High", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" }
  if (score >= 40) return { label: "Med", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" }
  return { label: "Low", cls: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const { label, cls } = getLevel(score)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        cls,
        className
      )}
      title={`Compliance score: ${score}/100`}
    >
      {label} <span className="tabular-nums opacity-70">{score}</span>
    </span>
  )
}
