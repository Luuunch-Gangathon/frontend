'use client'

// v2: Tuning is deferred post-hackathon. Route is unreachable (removed from nav).
export default function TuningPage() {
  return null
}

/*
import React, { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { getSupplierAllocations, applyTuning } from "@/lib/api"
import { RAW_MATERIALS, SUPPLIERS } from "@/lib/demo-data"
import type { SupplierAllocation } from "@/lib/types"

interface GroupedAllocation {
  rawMaterialId: string
  rawMaterialSku: string
  rows: SupplierAllocation[]
}

export default function TuningPageV2() {
  const [allocations, setAllocations] = useState<SupplierAllocation[]>([])
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSupplierAllocations().then((data) => {
      setAllocations(data)
      setLoading(false)
    })
  }, [])

  function allocationKey(a: SupplierAllocation) {
    return `${a.supplier_id}::${a.raw_material_id}`
  }

  function updateQty(supplierId: string, rawMaterialId: string, qty: number) {
    setAllocations((prev) =>
      prev.map((a) =>
        a.supplier_id === supplierId && a.raw_material_id === rawMaterialId
          ? { ...a, quantity_kg: qty }
          : a
      )
    )
    setDirty((prev) => new Set(prev).add(`${supplierId}::${rawMaterialId}`))
  }

  async function handleApply() {
    setSaving(true)
    try {
      await applyTuning({ allocations })
      setDirty(new Set())
      setToast("Changes applied successfully.")
    } catch {
      setToast("Failed to apply changes. Please try again.")
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const rmMap = new Map(RAW_MATERIALS.map((r) => [r.id, r.sku]))
  const supplierMap = new Map(SUPPLIERS.map((s) => [s.id, s.name]))

  const groups: GroupedAllocation[] = []
  for (const rm of RAW_MATERIALS) {
    const rows = allocations.filter((a) => a.raw_material_id === rm.id)
    if (rows.length > 0) {
      groups.push({ rawMaterialId: rm.id, rawMaterialSku: rm.sku, rows })
    }
  }

  if (loading) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground mt-8">Loading allocations…</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Tuning" }]} />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Supplier Allocation Tuning</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust per-supplier quantity allocations. Click Apply to commit changes.
        </p>
      </div>

      <div className="mt-8 space-y-6 pb-28">
        {groups.map((group) => (
          <div key={group.rawMaterialId} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">
              <code className="font-mono">{group.rawMaterialSku}</code>
            </h2>
            <div className="space-y-4">
              {group.rows.map((row) => {
                const key = allocationKey(row)
                const isDirty = dirty.has(key)
                return (
                  <div
                    key={key}
                    className={`rounded-lg border p-4 transition-colors ${isDirty ? "border-primary/60 bg-primary/5" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{supplierMap.get(row.supplier_id) ?? row.supplier_id}</span>
                      {isDirty && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          modified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={10000}
                        step={100}
                        value={row.quantity_kg}
                        onChange={(e) => updateQty(row.supplier_id, row.raw_material_id, Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={10000}
                          step={100}
                          value={row.quantity_kg}
                          onChange={(e) => updateQty(row.supplier_id, row.raw_material_id, Number(e.target.value))}
                          className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <span className="text-xs text-muted-foreground">kg</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <span className="text-sm text-muted-foreground">
            {dirty.size > 0
              ? `${dirty.size} allocation${dirty.size !== 1 ? "s" : ""} modified`
              : "No unsaved changes"}
          </span>
          <button
            onClick={handleApply}
            disabled={saving || dirty.size === 0}
            className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Applying…" : "Apply changes"}
          </button>
        </div>
      </div>

      {toast && (
        <div
          aria-live="polite"
          className="fixed bottom-20 right-6 z-30 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </AppShell>
  )
}
*/
