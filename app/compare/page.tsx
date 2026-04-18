"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { getOpportunity } from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { CompareTable } from "@/components/blocks/compare-table"
import { CompareRadar } from "@/components/blocks/compare-radar"

function CompareContent() {
  const searchParams = useSearchParams()
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean)
  const opportunities = ids
    .map((id) => getOpportunity(id))
    .filter((o): o is NonNullable<typeof o> => o != null)

  if (opportunities.length < 2) {
    return (
      <div className="mt-20 text-center">
        <p className="text-muted-foreground">Select 2–3 opportunities to compare.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Back to portfolio
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-2">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to portfolio
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-1">Opportunity comparison</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Comparing {opportunities.length} opportunities side by side.
      </p>
      <CompareTable opportunities={opportunities} />
      <div className="mt-8">
        <CompareRadar opportunities={opportunities} />
      </div>
    </>
  )
}

export default function ComparePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="mt-20 text-center text-sm text-muted-foreground">Loading…</div>}>
        <CompareContent />
      </Suspense>
    </AppShell>
  )
}
