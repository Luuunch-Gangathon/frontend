import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">Spherecast</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Supply Chain Co-Pilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              disabled
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground cursor-not-allowed opacity-60"
              title="Coming soon"
            >
              Ask Agent
            </button>
          </div>
        </div>
      </header>
      <main className={cn("mx-auto max-w-7xl px-6 py-8", className)}>
        {children}
      </main>
    </div>
  )
}
