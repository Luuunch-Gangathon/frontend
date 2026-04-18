'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getRawMaterials, getCompanies, getSuppliers } from '@/lib/api'
import { ScoreBadge } from './score-badge'
import type { RawMaterial, Company, Supplier } from '@/lib/types'
import type { AggregatedEntities, AggregatedMaterial } from '@/lib/aggregate-entities'

export type SidebarTab = 'materials' | 'companies' | 'suppliers'

interface ContextSidebarProps {
  aggregated: AggregatedEntities
  activeTab: SidebarTab
  onTabChange: (t: SidebarTab) => void
  hasAnyToolCalls: boolean
}

const TABS: { key: SidebarTab; label: string }[] = [
  { key: 'materials', label: 'Materials' },
  { key: 'companies', label: 'Companies' },
  { key: 'suppliers', label: 'Suppliers' },
]

export function ContextSidebar({ aggregated, activeTab, onTabChange, hasAnyToolCalls }: ContextSidebarProps) {
  const [browseRawMaterials, setBrowseRawMaterials] = useState<RawMaterial[]>([])
  const [browseCompanies, setBrowseCompanies] = useState<Company[]>([])
  const [browseSuppliers, setBrowseSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    getRawMaterials().then((mats) => setBrowseRawMaterials(mats.slice(0, 12))).catch(() => {})
    getCompanies().then((cos) => setBrowseCompanies(cos)).catch(() => {})
    getSuppliers().then((sups) => setBrowseSuppliers(sups)).catch(() => {})
  }, [])

  const companyIdMap = new Map(browseCompanies.map((c) => [c.name, c.id]))
  const supplierIdMap = new Map(browseSuppliers.map((s) => [s.name, s.id]))

  return (
    <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-border">
        {TABS.map((tab) => {
          const count =
            hasAnyToolCalls
              ? tab.key === 'materials'
                ? aggregated.materials.length
                : tab.key === 'companies'
                ? aggregated.companies.length
                : aggregated.suppliers.length
              : 0
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'materials' && (
          <MaterialsList
            hasToolCalls={hasAnyToolCalls}
            aggregated={aggregated.materials}
            browseRawMaterials={browseRawMaterials}
          />
        )}
        {activeTab === 'companies' && (
          <EntityList
            hasToolCalls={hasAnyToolCalls}
            items={aggregated.companies}
            browseItems={browseCompanies}
            idMap={companyIdMap}
            hrefPrefix="/companies"
            browseHref="/dictionary/companies"
            emptyLabel="No companies found yet"
          />
        )}
        {activeTab === 'suppliers' && (
          <EntityList
            hasToolCalls={hasAnyToolCalls}
            items={aggregated.suppliers}
            browseItems={browseSuppliers}
            idMap={supplierIdMap}
            hrefPrefix="/suppliers"
            browseHref="/dictionary/suppliers"
            emptyLabel="No suppliers found yet"
          />
        )}
      </div>
    </div>
  )
}

function MaterialsList({
  hasToolCalls,
  aggregated,
  browseRawMaterials,
}: {
  hasToolCalls: boolean
  aggregated: AggregatedMaterial[]
  browseRawMaterials: RawMaterial[]
}) {
  if (!hasToolCalls) {
    return (
      <div className="space-y-1">
        <p className="mb-2 text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Browse directory</p>
        {browseRawMaterials.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Loading…</p>
        ) : (
          <>
            {browseRawMaterials.map((m) => (
              <Link
                key={m.id}
                href={`/raw-materials/${m.id}`}
                className="flex items-center rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                <span className="font-mono text-foreground truncate">{m.sku}</span>
              </Link>
            ))}
            <Link
              href="/dictionary/raw-materials"
              className="mt-2 block rounded-md px-2 py-1.5 text-xs text-primary hover:underline"
            >
              Browse full directory →
            </Link>
          </>
        )}
      </div>
    )
  }

  if (aggregated.length === 0) {
    return <p className="text-xs text-muted-foreground italic px-2">No materials surfaced yet.</p>
  }

  return (
    <div className="space-y-1">
      {aggregated.map((m) => (
        <MaterialRow key={m.name} material={m} />
      ))}
    </div>
  )
}

function MaterialRow({ material: m }: { material: AggregatedMaterial }) {
  const inner = (
    <div className="flex items-start justify-between gap-2 rounded-md px-2 py-2 hover:bg-muted transition-colors">
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{m.name}</p>
        {m.isSubstitutionCandidate && m.bestScore != null && (
          <div className="mt-0.5 flex items-center gap-1.5">
            <ScoreBadge score={m.bestScore} />
            <span className="text-[10px] text-muted-foreground">substitute candidate</span>
          </div>
        )}
        {!m.isSubstitutionCandidate && m.bestSimilarity != null && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {Math.round(m.bestSimilarity * 100)}% match
          </p>
        )}
      </div>
    </div>
  )

  if (m.id != null) {
    return <Link href={`/raw-materials/${m.id}`}>{inner}</Link>
  }
  return inner
}

function EntityList({
  hasToolCalls,
  items,
  browseItems,
  idMap,
  hrefPrefix,
  browseHref,
  emptyLabel,
}: {
  hasToolCalls: boolean
  items: { name: string; materialCount: number }[]
  browseItems: { id: number; name: string }[]
  idMap: Map<string, number>
  hrefPrefix: string
  browseHref: string
  emptyLabel: string
}) {
  if (!hasToolCalls) {
    return (
      <div className="space-y-1">
        <p className="mb-2 text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Browse directory</p>
        {browseItems.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Loading…</p>
        ) : (
          <>
            {browseItems.slice(0, 12).map((entity) => (
              <Link
                key={entity.id}
                href={`${hrefPrefix}/${entity.id}`}
                className="flex items-center rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                <span className="text-foreground truncate">{entity.name}</span>
              </Link>
            ))}
            <Link
              href={browseHref}
              className="mt-2 block rounded-md px-2 py-1.5 text-xs text-primary hover:underline"
            >
              Browse full directory →
            </Link>
          </>
        )}
      </div>
    )
  }

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground italic px-2">{emptyLabel}</p>
  }

  return (
    <div className="space-y-1">
      {items.map(({ name, materialCount }) => {
        const id = idMap.get(name)
        const inner = (
          <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
            <span className="text-xs truncate">{name}</span>
            <span className="ml-2 shrink-0 text-[10px] text-muted-foreground">{materialCount} mat.</span>
          </div>
        )
        if (id != null) {
          return (
            <Link key={name} href={`${hrefPrefix}/${id}`}>
              {inner}
            </Link>
          )
        }
        return <div key={name}>{inner}</div>
      })}
    </div>
  )
}
