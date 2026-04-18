'use client'

import { useEffect, useState } from 'react'
import { getProducts, getCompanies } from '@/lib/api'
import type { Product } from '@/lib/types'

interface ProductPickerProps {
  onSelect: (product: Product, companyName: string) => void
}

export function ProductPicker({ onSelect }: ProductPickerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [companyMap, setCompanyMap] = useState<Map<number, string>>(new Map())
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getCompanies()])
      .then(([p, c]) => {
        setProducts(p)
        setCompanyMap(new Map(c.map((co) => [co.id, co.name])))
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const q = filter.toLowerCase().trim()
    if (!q) return true
    const company = companyMap.get(p.company_id) ?? ''
    return p.sku.toLowerCase().includes(q) || company.toLowerCase().includes(q)
  })

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
            📦
          </span>
          <div>
            <h2 className="text-lg font-semibold">Start a new chat</h2>
            <p className="text-sm text-muted-foreground">
              Select a finished-good product to ground the conversation.
            </p>
          </div>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by SKU or company…"
          className="mt-5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <div className="mt-3 max-h-[420px] overflow-y-auto rounded-md border border-border bg-background">
          {loading && (
            <p className="p-4 text-sm text-muted-foreground italic">Loading products…</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground italic">No products match.</p>
          )}
          {!loading && filtered.length > 0 && (
            <ul className="divide-y divide-border">
              {filtered.map((p) => {
                const companyName = companyMap.get(p.company_id) ?? `Company #${p.company_id}`
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => onSelect(p, companyName)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <code className="font-mono text-sm font-medium">{p.sku}</code>
                      <span className="text-xs text-muted-foreground">{companyName}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} available
        </p>
      </div>
    </div>
  )
}
