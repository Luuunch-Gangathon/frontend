import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavTabs } from "@/components/layout/nav-tabs"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background text-foreground">
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-base font-semibold tracking-tight">Spherecast</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Supply Chain Co-Pilot</span>
          </Link>
          <NavTabs />
        </div>
      </header>
      <main className={cn("flex-1 overflow-hidden mx-auto w-full max-w-7xl px-6 py-8", className)}>
        {children}
      </main>
    </div>
  )
}
