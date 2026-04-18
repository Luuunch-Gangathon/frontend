'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getRawMaterials,
  getCompanies,
  getSuppliers,
  getRawMaterialSubstitutes,
  scoreSubstituteCandidate,
} from '@/lib/api'
import { ScoreBadge } from './score-badge'
import { SkuText } from './sku-text'
import type {
  RawMaterial,
  Company,
  Supplier,
  SubstituteProposal,
  SubstituteCandidate,
} from '@/lib/types'
import type { AggregatedEntities, AggregatedMaterial } from '@/lib/aggregate-entities'

type SubstitutesState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; candidates: SubstituteCandidate[] }
  | { status: 'error'; message: string }

type ProposalState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; proposal: SubstituteProposal }
  | { status: 'error'; message: string }

function candidateKey(originalRmId: number, candidateRmId: number): string {
  return `${originalRmId}:${candidateRmId}`
}

export type SidebarTab = 'materials' | 'companies' | 'suppliers'

interface ContextSidebarProps {
  aggregated: AggregatedEntities
  activeTab: SidebarTab
  onTabChange: (t: SidebarTab) => void
  hasAnyToolCalls: boolean
  productId: number
}

const TABS: { key: SidebarTab; label: string }[] = [
  { key: 'materials', label: 'Materials' },
  { key: 'companies', label: 'Companies' },
  { key: 'suppliers', label: 'Suppliers' },
]

export function ContextSidebar({ aggregated, activeTab, onTabChange, hasAnyToolCalls, productId }: ContextSidebarProps) {
  const [browseRawMaterials, setBrowseRawMaterials] = useState<RawMaterial[]>([])
  const [browseCompanies, setBrowseCompanies] = useState<Company[]>([])
  const [browseSuppliers, setBrowseSuppliers] = useState<Supplier[]>([])
  const [substitutesStates, setSubstitutesStates] = useState<Map<number, SubstitutesState>>(new Map())
  const [proposalStates, setProposalStates] = useState<Map<string, ProposalState>>(new Map())

  useEffect(() => {
    getRawMaterials().then((mats) => setBrowseRawMaterials(mats.slice(0, 12))).catch(() => {})
    getCompanies().then((cos) => setBrowseCompanies(cos)).catch(() => {})
    getSuppliers().then((sups) => setBrowseSuppliers(sups)).catch(() => {})
  }, [])

  const fetchSubstitutes = (rawMaterialId: number) => {
    setSubstitutesStates((prev) => {
      const next = new Map(prev)
      next.set(rawMaterialId, { status: 'loading' })
      return next
    })
    getRawMaterialSubstitutes(rawMaterialId)
      .then((candidates) => {
        setSubstitutesStates((prev) => {
          const next = new Map(prev)
          next.set(rawMaterialId, { status: 'loaded', candidates })
          return next
        })
      })
      .catch(() => {
        setSubstitutesStates((prev) => {
          const next = new Map(prev)
          next.set(rawMaterialId, { status: 'error', message: 'Could not load substitutes.' })
          return next
        })
      })
  }

  const fetchProposal = (originalRmId: number, candidateRmId: number) => {
    const key = candidateKey(originalRmId, candidateRmId)
    setProposalStates((prev) => {
      const next = new Map(prev)
      next.set(key, { status: 'loading' })
      return next
    })
    scoreSubstituteCandidate(productId, originalRmId, candidateRmId)
      .then((proposal) => {
        setProposalStates((prev) => {
          const next = new Map(prev)
          next.set(key, { status: 'loaded', proposal })
          return next
        })
      })
      .catch(() => {
        setProposalStates((prev) => {
          const next = new Map(prev)
          next.set(key, { status: 'error', message: 'Compliance check failed.' })
          return next
        })
      })
  }

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
            substitutesStates={substitutesStates}
            proposalStates={proposalStates}
            onFetchSubstitutes={fetchSubstitutes}
            onFetchProposal={fetchProposal}
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

interface MaterialsListProps {
  hasToolCalls: boolean
  aggregated: AggregatedMaterial[]
  browseRawMaterials: RawMaterial[]
  substitutesStates: Map<number, SubstitutesState>
  proposalStates: Map<string, ProposalState>
  onFetchSubstitutes: (rawMaterialId: number) => void
  onFetchProposal: (originalRmId: number, candidateRmId: number) => void
}

function MaterialsList({
  hasToolCalls,
  aggregated,
  browseRawMaterials,
  substitutesStates,
  proposalStates,
  onFetchSubstitutes,
  onFetchProposal,
}: MaterialsListProps) {
  if (!hasToolCalls) {
    return (
      <div className="space-y-1">
        <p className="mb-2 text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Browse directory</p>
        {browseRawMaterials.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Loading…</p>
        ) : (
          <>
            {browseRawMaterials.map((m) => (
              <BrowseMaterialRow
                key={m.id}
                material={m}
                substitutesState={substitutesStates.get(m.id) ?? { status: 'idle' }}
                proposalStates={proposalStates}
                onFetchSubstitutes={onFetchSubstitutes}
                onFetchProposal={onFetchProposal}
              />
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
        <MaterialRow
          key={m.name}
          material={m}
          substitutesState={m.id != null ? substitutesStates.get(m.id) ?? { status: 'idle' } : undefined}
          proposalStates={proposalStates}
          onFetchSubstitutes={onFetchSubstitutes}
          onFetchProposal={onFetchProposal}
        />
      ))}
    </div>
  )
}

function BrowseMaterialRow({
  material,
  substitutesState,
  proposalStates,
  onFetchSubstitutes,
  onFetchProposal,
}: {
  material: RawMaterial
  substitutesState: SubstitutesState
  proposalStates: Map<string, ProposalState>
  onFetchSubstitutes: (rawMaterialId: number) => void
  onFetchProposal: (originalRmId: number, candidateRmId: number) => void
}) {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    if (substitutesState.status === 'idle') onFetchSubstitutes(material.id)
    setOpen((v) => !v)
  }
  return (
    <div className="rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Link href={`/raw-materials/${material.id}`} className="flex-1 min-w-0 text-xs">
          <span className="font-mono text-foreground truncate">{material.sku}</span>
        </Link>
        <SubstitutesToggle state={substitutesState} open={open} onClick={handleClick} />
      </div>
      {open && (
        <SubstitutesPanel
          state={substitutesState}
          originalRmId={material.id}
          proposalStates={proposalStates}
          onRetry={() => onFetchSubstitutes(material.id)}
          onFetchProposal={onFetchProposal}
        />
      )}
    </div>
  )
}

function MaterialRow({
  material: m,
  substitutesState,
  proposalStates,
  onFetchSubstitutes,
  onFetchProposal,
}: {
  material: AggregatedMaterial
  substitutesState: SubstitutesState | undefined
  proposalStates: Map<string, ProposalState>
  onFetchSubstitutes: (rawMaterialId: number) => void
  onFetchProposal: (originalRmId: number, candidateRmId: number) => void
}) {
  const [open, setOpen] = useState(false)

  const meta = (
    <div className="flex-1 min-w-0">
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
  )

  const metaWithLink =
    m.id != null ? <Link href={`/raw-materials/${m.id}`} className="flex-1 min-w-0">{meta}</Link> : meta

  const handleClick = () => {
    if (m.id == null) return
    if (substitutesState?.status === 'idle') onFetchSubstitutes(m.id)
    setOpen((v) => !v)
  }

  return (
    <div className="rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-2 px-2 py-2">
        {metaWithLink}
        {m.id != null && substitutesState && (
          <SubstitutesToggle state={substitutesState} open={open} onClick={handleClick} />
        )}
      </div>
      {open && m.id != null && substitutesState && (
        <SubstitutesPanel
          state={substitutesState}
          originalRmId={m.id}
          proposalStates={proposalStates}
          onRetry={() => m.id != null && onFetchSubstitutes(m.id)}
          onFetchProposal={onFetchProposal}
        />
      )}
    </div>
  )
}

function Spinner({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-spin text-current`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}

function SubstitutesToggle({
  state,
  open,
  onClick,
}: {
  state: SubstitutesState
  open: boolean
  onClick: () => void
}) {
  const isError = state.status === 'error'
  const count = state.status === 'loaded' ? state.candidates.length : null

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      aria-expanded={open}
      title={
        isError
          ? 'Retry substitutes lookup'
          : count != null
          ? `${count} substitute${count === 1 ? '' : 's'} found`
          : 'Show substitutes'
      }
      className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition-colors ${
        isError
          ? 'border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10'
          : count != null
          ? 'border-border bg-background text-foreground hover:bg-muted'
          : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
      }`}
    >
      {isError ? (
        <>
          <span>Retry</span>
          <span aria-hidden>↻</span>
        </>
      ) : count != null ? (
        <>
          <span>{count === 0 ? 'No substitutes' : `${count} substitute${count === 1 ? '' : 's'}`}</span>
          <span aria-hidden>{open ? '▲' : '▼'}</span>
        </>
      ) : (
        <>
          <span>Show substitutes</span>
          <span aria-hidden>{open ? '▲' : '▼'}</span>
        </>
      )}
    </button>
  )
}

function SubstitutesPanel({
  state,
  originalRmId,
  proposalStates,
  onRetry,
  onFetchProposal,
}: {
  state: SubstitutesState
  originalRmId: number
  proposalStates: Map<string, ProposalState>
  onRetry: () => void
  onFetchProposal: (originalRmId: number, candidateRmId: number) => void
}) {
  if (state.status === 'idle') return null

  if (state.status === 'loading') {
    return (
      <div className="mx-2 mb-2 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-2.5 text-xs text-muted-foreground">
        <Spinner />
        <span className="italic">Finding substitutes…</span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="mx-2 mb-2 flex items-center justify-between gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-2.5">
        <p className="text-xs text-red-600">{state.message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-red-500/30 bg-background px-2 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-500/10 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const { candidates } = state
  if (candidates.length === 0) {
    return (
      <div className="mx-2 mb-2 rounded-md border border-dashed border-border bg-muted/30 p-2.5">
        <p className="text-xs italic text-muted-foreground">
          No similar materials above the similarity threshold.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-2 mb-2 space-y-1.5 rounded-md border border-border bg-card p-2">
      <p className="px-1 text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
        Substitute candidates
      </p>
      <ul className="space-y-1.5">
        {candidates.map((c) => (
          <CandidateRow
            key={c.id}
            originalRmId={originalRmId}
            candidate={c}
            state={proposalStates.get(candidateKey(originalRmId, c.id)) ?? { status: 'idle' }}
            onFetchProposal={onFetchProposal}
          />
        ))}
      </ul>
    </div>
  )
}

function CandidateRow({
  originalRmId,
  candidate,
  state,
  onFetchProposal,
}: {
  originalRmId: number
  candidate: SubstituteCandidate
  state: ProposalState
  onFetchProposal: (originalRmId: number, candidateRmId: number) => void
}) {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    if (state.status === 'idle') onFetchProposal(originalRmId, candidate.id)
    setOpen((v) => !v)
  }
  const loading = state.status === 'loading'
  const loadedProposal = state.status === 'loaded' ? state.proposal : null
  const isError = state.status === 'error'

  return (
    <li className="rounded-md border border-border/60 bg-background">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Link
          href={`/raw-materials/${candidate.id}`}
          className="flex-1 min-w-0 text-xs"
          title={`Similarity ${Math.round(candidate.similarity_score * 100)}%`}
        >
          <span className="font-mono text-foreground truncate">{candidate.sku}</span>
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleClick()
          }}
          disabled={loading}
          aria-expanded={open}
          title={
            loading
              ? 'Checking compliance…'
              : loadedProposal
              ? 'Show compliance reasoning'
              : isError
              ? 'Retry compliance check'
              : 'Check compliance for this candidate'
          }
          className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors ${
            loadedProposal
              ? 'border-border bg-background text-foreground hover:bg-muted'
              : isError
              ? 'border-red-500/30 bg-red-500/5 text-red-600 hover:bg-red-500/10'
              : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
          } disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {loading ? (
            <>
              <Spinner />
              <span>Checking…</span>
            </>
          ) : loadedProposal ? (
            <>
              <ScoreBadge score={loadedProposal.score} className="px-1.5 py-0" />
              <span aria-hidden>{open ? '▲' : '▼'}</span>
            </>
          ) : isError ? (
            <>
              <span>Retry</span>
              <span aria-hidden>↻</span>
            </>
          ) : (
            <>
              <span>Check compliance</span>
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
      {open && (
        <CandidateProposalDetail
          state={state}
          onRetry={() => onFetchProposal(originalRmId, candidate.id)}
        />
      )}
    </li>
  )
}

function CandidateProposalDetail({
  state,
  onRetry,
}: {
  state: ProposalState
  onRetry: () => void
}) {
  if (state.status === 'idle') return null
  if (state.status === 'loading') {
    return (
      <div className="mx-2 mb-2 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-2 text-xs text-muted-foreground">
        <Spinner />
        <span className="italic">Running compliance check…</span>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="mx-2 mb-2 flex items-center justify-between gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-2">
        <p className="text-xs text-red-600">{state.message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-red-500/30 bg-background px-2 py-0.5 text-[10px] font-medium text-red-600 hover:bg-red-500/10 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }
  const { proposal } = state
  return (
    <div className="mx-2 mb-2 rounded-md border border-border bg-card p-2 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
          Compliance reasoning
        </span>
        <ScoreBadge score={proposal.score} />
      </div>
      <p className="text-xs leading-relaxed text-foreground/90">
        <SkuText>{proposal.reasoning}</SkuText>
      </p>
    </div>
  )
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
