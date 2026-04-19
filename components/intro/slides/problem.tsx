'use client'

import { AmbientGrid } from '../ambient-grid'

const CARDS = [
  {
    name: 'REACH_EU_2024_v3.pdf',
    meta: 'last edited · 47d ago',
    icon: '≡',
    tilt: -8,
    floatDur: 8,
    floatDelay: 0,
  },
  {
    name: 'suppliers_final_FINAL_v12.xlsx',
    meta: 'last modified · 12d ago',
    icon: '⊞',
    tilt: -3,
    floatDur: 9,
    floatDelay: 2,
  },
  {
    name: 'RE: RE: FW: Ingredient sub\u2026',
    meta: 'received · 8d ago',
    icon: '@',
    tilt: 3,
    floatDur: 10,
    floatDelay: 4,
  },
  {
    name: '#sourcing · 342 msgs',
    meta: 'last activity · 2h ago',
    icon: '#',
    tilt: 8,
    floatDur: 7,
    floatDelay: 1,
  },
]

const Y_OFFSETS = [-70, -23, 23, 70]

interface ProblemProps {
  active: boolean
  onExit: () => void
}

export function Problem({ active }: ProblemProps) {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientGrid />

      {/* Left: headline stack */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-8 pl-[10%] max-w-[55%]">
        <p
          className="text-[clamp(0.85rem,1.6vw,1.15rem)] uppercase tracking-[0.2em] text-white/65 font-mono"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease 0ms, transform 0.5s ease 0ms',
          }}
        >
          The Problem
        </p>

        <h1
          className="font-bold text-white leading-tight"
          style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.6rem)',
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 120ms, transform 0.6s ease 120ms',
          }}
        >
          A single question can take three weeks to answer.
        </h1>

        <p
          className="text-white/80 leading-relaxed"
          style={{
            fontSize: 'clamp(1.2rem, 2.1vw, 1.6rem)',
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 240ms, transform 0.6s ease 240ms',
          }}
        >
          Sourcing knowledge is trapped in PDFs, inboxes, and spreadsheets across the internet.
        </p>
      </div>

      {/* Right: scattered source cards */}
      <div className="relative z-10 flex-1 flex items-center justify-center pr-[8%]">
        <div className="relative" style={{ width: '380px', height: '380px' }}>
          {CARDS.map((card, i) => (
            <div
              key={card.name}
              className="absolute"
              style={{
                width: '320px',
                left: '50%',
                top: '50%',
                marginLeft: '-160px',
                marginTop: `${Y_OFFSETS[i] - 42}px`,
                transform: `rotate(${card.tilt}deg)`,
                opacity: active ? 1 : 0,
                transition: `opacity 0.5s ease ${360 + i * 120}ms`,
                zIndex: 4 - i,
              }}
            >
              <div
                className="rounded-xl border border-white/10 p-4 flex flex-col gap-2"
                style={{
                  background: 'oklch(0.13 0 0)',
                  animation: active
                    ? `floatCard ${card.floatDur}s ease-in-out ${card.floatDelay}s infinite`
                    : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white/55 text-base w-5 shrink-0 text-center">
                    {card.icon}
                  </span>
                  <span className="font-mono text-sm text-white/85 truncate">{card.name}</span>
                </div>
                <p className="font-mono text-[11px] text-white/60 pl-8">{card.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
