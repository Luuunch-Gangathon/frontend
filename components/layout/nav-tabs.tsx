"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
  { label: "Chat", href: "/" },
  { label: "Dictionary", href: "/dictionary" },
]

export function NavTabs() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="flex items-center gap-1 ml-6">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            isActive(tab.href)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
