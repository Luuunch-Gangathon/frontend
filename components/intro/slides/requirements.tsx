'use client'

import { AmbientGrid } from '../ambient-grid'

type Status = 'done' | 'data-ready' | 'pending'

const REQUIREMENTS: { id: string; text: string; status: Status; note?: string }[] = [
  { id: 'R1', text: 'Ingest BOM & supplier data', status: 'done' },
  { id: 'R2', text: 'Enrich materials with external knowledge', status: 'done' },
  { id: 'R3', text: 'Identify interchangeable components', status: 'done' },
  { id: 'R4', text: 'Infer compliance & quality bar', status: 'done' },
  { id: 'R5', text: 'Score substitutes with explainable reasoning', status: 'done', note: 'improved' },
  { id: 'R6', text: 'Preserve evidence trails', status: 'done' },
  { id: 'R7', text: 'Surface portfolio fragmentation', status: 'data-ready' },
  { id: 'R8', text: 'Consolidated sourcing proposals', status: 'pending' },
  { id: 'R9', text: 'Conversational reasoning interface', status: 'done', note: 'improved' },
]

const STATUS_STYLES: Record<
  Status,
  { label: string; color: string; dot: string; glyph: string }
> = {
  done: {
    label: 'Shipped',
    color: 'oklch(0.82 0.14 150)',
    dot: 'oklch(0.68 0.17 150)',
    glyph: '\u2713',
  },
  'data-ready': {
    label: 'Data ready',
    color: 'oklch(0.85 0.13 85)',
    dot: 'oklch(0.75 0.16 85)',
    glyph: '\u25D0',
  },
  pending: {
    label: 'Next',
    color: 'oklch(0.82 0.13 40)',
    dot: 'oklch(0.72 0.17 40)',
    glyph: '\u2192',
  },
}

interface RequirementsProps {
  active: boolean
  onExit: () => void
}

export function Requirements({ active }: RequirementsProps) {
  const shipped = REQUIREMENTS.filter((r) => r.status === 'done').length
  const dataReady = REQUIREMENTS.filter((r) => r.status === 'data-ready').length
  const pending = REQUIREMENTS.filter((r) => r.status === 'pending').length

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-10 px-[5%]">
      <AmbientGrid />

      {/* Headline */}
      <div
        className="relative z-10 text-center"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease 0ms, transform 0.6s ease 0ms',
        }}
      >
        <p className="text-[clamp(0.85rem,1.6vw,1.15rem)] uppercase tracking-[0.22em] text-white/65 font-mono mb-3">
          Functional Requirements
        </p>
        <h2 className="font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
          Built for the brief.
        </h2>
      </div>

      {/* 3×3 grid */}
      <div className="relative z-10 grid grid-cols-3 gap-4 w-full max-w-5xl">
        {REQUIREMENTS.map((req, i) => {
          const style = STATUS_STYLES[req.status]
          return (
            <div
              key={req.id}
              className="flex flex-col gap-3 rounded-xl border border-white/8 p-5"
              style={{
                background: 'oklch(0.11 0 0)',
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${200 + i * 70}ms, transform 0.5s ease ${200 + i * 70}ms`,
                boxShadow:
                  req.status === 'done'
                    ? `inset 0 0 0 1px oklch(1 0 0 / 0.02), 0 0 28px -18px ${style.dot}`
                    : 'inset 0 0 0 1px oklch(1 0 0 / 0.02)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">
                  {req.id}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    color: style.color,
                    background: 'oklch(1 0 0 / 0.04)',
                  }}
                >
                  <span style={{ fontSize: '11px' }}>{style.glyph}</span>
                  {style.label}
                </span>
              </div>
              <p className="text-white/90 text-[clamp(1rem,1.3vw,1.2rem)] leading-snug">
                {req.text}
              </p>
              {req.note && (
                <p className="font-mono text-[11px] text-white/45 tracking-wide">
                  · {req.note}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress strip + stat */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 w-full max-w-5xl"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.6s ease ${200 + REQUIREMENTS.length * 70 + 200}ms`,
        }}
      >
        <div className="flex gap-1.5 w-full">
          {REQUIREMENTS.map((req, i) => (
            <div
              key={req.id}
              className="flex-1 h-[3px] rounded-full"
              style={{
                background: STATUS_STYLES[req.status].dot,
                opacity: active ? 0.75 : 0,
                transition: `opacity 0.4s ease ${900 + i * 60}ms`,
              }}
            />
          ))}
        </div>
        <p className="font-mono text-[13px] text-white/55 tracking-wide">
          <span className="text-white/90 font-bold">{shipped}</span> shipped
          <span className="text-white/25 mx-2">·</span>
          <span className="text-white/90 font-bold">{dataReady}</span> data-ready
          <span className="text-white/25 mx-2">·</span>
          <span className="text-white/90 font-bold">{pending}</span> next up
        </p>
      </div>
    </div>
  )
}
