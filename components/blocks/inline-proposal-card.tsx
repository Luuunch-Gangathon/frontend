'use client'

import { ScoreBadge } from './score-badge'
import { postDecision } from '@/lib/api'
import type { ComplianceMatch, DecisionCreate } from '@/lib/types'

interface InlineProposalCardProps {
  match: ComplianceMatch
  originalName: string
  productSku?: string | null
  sessionId: string
  decision?: 'accepted' | 'declined'
  onDecision: (substituteName: string, status: 'accepted' | 'declined') => void
}

export function InlineProposalCard({
  match,
  originalName,
  productSku,
  sessionId,
  decision,
  onDecision,
}: InlineProposalCardProps) {
  async function handleDecision(status: 'accepted' | 'declined') {
    const body: DecisionCreate = {
      session_id: sessionId,
      status,
      original_raw_material_name: originalName,
      substitute_raw_material_name: match.raw_material_name,
      product_sku: productSku ?? undefined,
      score: match.score,
      reasoning: match.reasoning,
    }
    try {
      await postDecision(body)
    } catch {
      // best-effort persist; still update local state
    }
    onDecision(match.raw_material_name, status)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug">{match.raw_material_name}</span>
        <ScoreBadge score={match.score} className="shrink-0" />
      </div>

      <p className="text-xs text-muted-foreground line-clamp-3">{match.reasoning}</p>

      {match.companies_affected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {match.companies_affected.slice(0, 4).map((c) => (
            <span
              key={c}
              className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
          {match.companies_affected.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{match.companies_affected.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {decision ? (
          <span
            className={`text-xs font-medium ${decision === 'accepted' ? 'text-emerald-600' : 'text-muted-foreground'}`}
          >
            {decision === 'accepted' ? 'Accepted ✓' : 'Declined ✕'}
          </span>
        ) : (
          <>
            <button
              onClick={() => handleDecision('accepted')}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecision('declined')}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  )
}
