'use client'

import { useEffect, useState } from 'react'

const QUOTES = [
  'Ask anything.',
  'Find a raw material substitution.',
  'Check compliance across suppliers.',
]

interface FeatureTeaserProps {
  active: boolean
}

export function FeatureTeaser({ active }: FeatureTeaserProps) {
  const [visibleQuotes, setVisibleQuotes] = useState(0)

  useEffect(() => {
    if (!active) {
      setVisibleQuotes(0)
      return
    }
    const timers = QUOTES.map((_, i) =>
      setTimeout(() => setVisibleQuotes(i + 1), 500 + i * 650)
    )
    return () => timers.forEach(clearTimeout)
  }, [active])

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-16 px-[6%]">
      {/* Pull-quotes — left column */}
      <div className="flex flex-col gap-6 w-64 shrink-0">
        {QUOTES.map((q, i) => (
          <p
            key={i}
            className="text-[clamp(1rem,1.55vw,1.25rem)] font-medium text-white/90 leading-snug"
            style={{
              opacity: i < visibleQuotes ? 1 : 0,
              transform: i < visibleQuotes ? 'translateX(0)' : 'translateX(-14px)',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
            }}
          >
            {q}
          </p>
        ))}
      </div>

      {/* Chat mock — center */}
      <div
        className="flex-1 max-w-2xl rounded-xl border border-white/10 bg-[oklch(0.1_0_0)] overflow-hidden"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          boxShadow: '0 0 80px oklch(0.15 0 0 / 0.8), 0 0 0 1px oklch(1 0 0 / 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/15" />
            <div className="w-3 h-3 rounded-full bg-white/15" />
            <div className="w-3 h-3 rounded-full bg-white/15" />
          </div>
          <span className="ml-3 text-xs text-white/60 font-mono tracking-wide">
            spherecast · supply chain co-pilot
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4 p-5">
          {/* User message */}
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-white/10 shrink-0 mt-0.5" />
            <div className="rounded-lg bg-white/6 border border-white/8 px-4 py-2.5 text-base text-white/85 max-w-sm">
              Which raw material can replace Titanium Dioxide in our EU products?
            </div>
          </div>

          {/* Assistant message */}
          <div className="flex gap-2.5 justify-end items-start">
            <div className="rounded-lg bg-[oklch(0.28_0.06_264)] border border-white/10 px-4 py-2.5 text-base text-white/80 max-w-md">
              Found 3 compliant alternatives across 12 suppliers. Analyzing compliance…
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
