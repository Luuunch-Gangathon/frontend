"use client"
import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

function CartIcon() {
  const { items } = useCart()
  return (
    <Link
      href="/plan"
      className="relative ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Action plan"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span className="hidden sm:block text-xs">Plan</span>
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {items.length}
        </span>
      )}
    </Link>
  )
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">Spherecast</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Supply Chain Co-Pilot</span>
          </Link>
          <CartIcon />
        </div>
      </header>
      <main className={cn("mx-auto max-w-7xl px-6 py-8", className)}>
        {children}
      </main>
    </div>
  )
}
