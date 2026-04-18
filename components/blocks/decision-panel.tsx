'use client'

import { useState } from 'react'
import type { Decision } from '@/lib/types'
import { createDecision } from '@/lib/api'

interface DecisionPanelProps {
  proposalId: number
  initialDecision: Decision | null
}

export function DecisionPanel({ proposalId, initialDecision }: DecisionPanelProps) {
  const [decision, setDecision] = useState<Decision | null>(initialDecision)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAccept() {
    setLoading(true)
    setError(null)
    try {
      const d = await createDecision(proposalId, { status: 'accepted' })
      setDecision(d)
    } catch {
      setError('Failed to save decision. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!reason.trim()) return
    setLoading(true)
    setError(null)
    try {
      const d = await createDecision(proposalId, { status: 'rejected', reason: reason.trim() })
      setDecision(d)
      setShowRejectForm(false)
      setReason('')
    } catch {
      setError('Failed to save decision. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (decision) {
    const isAccepted = decision.status === 'accepted'
    return (
      <div
        className={`rounded-lg border p-5 ${
          isAccepted
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
            : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              isAccepted
                ? 'text-emerald-800 dark:text-emerald-300'
                : 'text-red-800 dark:text-red-300'
            }`}
          >
            {isAccepted ? '✓ Proposal accepted' : '✗ Proposal rejected'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(decision.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {decision.reason && (
          <p className="mt-2 text-sm text-muted-foreground">{decision.reason}</p>
        )}
        <button
          onClick={() => { setDecision(null); setShowRejectForm(false); setReason('') }}
          className="mt-3 text-xs text-muted-foreground underline hover:text-foreground"
        >
          Change decision
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <p className="text-sm text-muted-foreground">
        Record your sourcing decision for this proposal:
      </p>

      {!showRejectForm ? (
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving…' : 'Accept proposal'}
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
            className="flex-1 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            Reject proposal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you rejecting this proposal? (required)"
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={loading || !reason.trim()}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving…' : 'Confirm rejection'}
            </button>
            <button
              onClick={() => { setShowRejectForm(false); setReason('') }}
              disabled={loading}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
