'use client'

import { useState } from 'react'
import { SearchResultsList } from './search-results-list'
import { InlineProposalCard } from './inline-proposal-card'
import type { ToolCall, SearchHit, ComplianceMatch } from '@/lib/types'

interface ToolCallBlockProps {
  toolCall: ToolCall
  sessionId: string
  decisions: Record<string, 'accepted' | 'declined'>
  onDecision: (key: string, status: 'accepted' | 'declined') => void
}

function formatArgs(name: string, args: Record<string, unknown>): string {
  if (name === 'search') return `search("${args.query ?? ''}")`
  if (name === 'similarity_compliance_check') {
    const orig = args.original_name ?? args.original_name ?? '?'
    return `compliance_check("${orig}")`
  }
  if (name === 'web_search_enrich') return `web_search_enrich("${args.query ?? ''}")`
  return name
}

function icon(name: string) {
  if (name === 'search') return '🔍'
  if (name === 'similarity_compliance_check') return '⚖️'
  if (name === 'web_search_enrich') return '🌐'
  return '🔧'
}

export function ToolCallBlock({ toolCall, sessionId, decisions, onDecision }: ToolCallBlockProps) {
  const [open, setOpen] = useState(false)

  const label = `${icon(toolCall.name)} ${formatArgs(toolCall.name, toolCall.arguments)}`
  const resultCount = toolCall.result.length

  // Determine original_name for proposal cards
  const originalName = (toolCall.arguments.original_name as string | undefined) ?? ''
  const productSku = (toolCall.arguments.product_sku as string | undefined) ?? null

  return (
    <div className="rounded-md border border-dashed border-border bg-transparent text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="font-mono text-muted-foreground">{label}</span>
        <span className="text-muted-foreground/60 ml-2">
          {resultCount} result{resultCount !== 1 ? 's' : ''} {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-3">
          {toolCall.name === 'search' && (
            <SearchResultsList hits={toolCall.result as SearchHit[]} />
          )}
          {toolCall.name === 'similarity_compliance_check' && (
            <div className="space-y-2">
              {(toolCall.result as ComplianceMatch[]).map((match) => {
                const key = `${originalName}__${match.raw_material_name}`
                return (
                  <InlineProposalCard
                    key={match.raw_material_name}
                    match={match}
                    originalName={originalName}
                    productSku={productSku}
                    sessionId={sessionId}
                    decision={decisions[key]}
                    onDecision={(subName, status) =>
                      onDecision(`${originalName}__${subName}`, status)
                    }
                  />
                )
              })}
            </div>
          )}
          {toolCall.name === 'web_search_enrich' && (
            <div className="flex flex-wrap gap-1">
              {(toolCall.result as string[]).map((name) => (
                <span
                  key={name}
                  className="rounded bg-blue-500/10 px-2 py-0.5 font-mono text-blue-400 border border-blue-500/20"
                >
                  {name}
                </span>
              ))}
              {(toolCall.result as string[]).length === 0 && (
                <span className="text-muted-foreground italic">No new candidates discovered</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
