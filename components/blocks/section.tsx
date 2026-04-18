import { cn } from "@/lib/utils"
import React from "react"

interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("mt-10", className)}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}
