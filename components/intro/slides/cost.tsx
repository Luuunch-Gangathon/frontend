'use client'

import { useEffect, useState } from 'react'
import { AmbientGrid } from '../ambient-grid'

const METRICS = [
  {
    target: 3.95,
    duration: 1300,
    label: 'RAG Context',
    caption: 'Vectorized the judges\u2019 original dataset.',
    glyph: '\u25A3',
    delay: 200,
    hue: 150,
  },
  {
    target: 4.95,
    duration: 1500,
    label: 'Search Engine',
    caption: 'Embedded the supplier, compliance & substitution data we scraped on top.',
    glyph: '\u25CE',
    delay: 350,
    hue: 190,
  },
]

function useCountUp(target: number, active: boolean, duration: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) {
      setCount(0)
      return
    }
    let startTime: number | null = null
    let raf = 0
    function step(ts: number) {
      if (startTime === null) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * target)
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return count
}

interface CostProps {
  active: boolean
  onExit: () => void
}

export function Cost({ active }: CostProps) {
  const c0 = useCountUp(METRICS[0].target, active, METRICS[0].duration)
  const c1 = useCountUp(METRICS[1].target, active, METRICS[1].duration)
  const counts = [c0, c1]
  const total = c0 + c1
  const totalTarget = METRICS[0].target + METRICS[1].target

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <AmbientGrid />

      <div className="relative z-10 flex flex-col items-center gap-14 w-full px-[6%]">
        {/* Headline */}
        <div
          className="text-center"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0ms, transform 0.6s ease 0ms',
          }}
        >
          <p className="text-[clamp(0.85rem,1.6vw,1.15rem)] uppercase tracking-[0.22em] text-white/65 font-mono mb-3">
            Cost
          </p>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Cheaper than a lunch.
          </h2>
          <p className="text-white/60 text-[clamp(0.95rem,1.3vw,1.15rem)] mt-4 max-w-2xl mx-auto leading-snug">
            Total spend to build every embedding for our enhanced dataset — the
            judges&rsquo; data plus the knowledge we scraped on top.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className="flex flex-col items-center gap-5"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${metric.delay}ms, transform 0.6s ease ${metric.delay}ms`,
              }}
            >
              {/* Icon chip */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-white/90 text-xl"
                style={{ background: `oklch(0.28 0.06 ${metric.hue})` }}
              >
                {metric.glyph}
              </div>

              {/* Count-up number */}
              <div
                className="font-mono font-bold text-white leading-none"
                style={{ fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)' }}
              >
                {'\u20AC'}
                {counts[i].toFixed(2)}
              </div>

              {/* Label */}
              <p
                className="text-center text-white/70 uppercase tracking-[0.2em]"
                style={{ fontSize: '13px' }}
              >
                {metric.label}
              </p>

              {/* Caption */}
              <p className="text-center text-white/80 text-base leading-snug max-w-xs">
                {metric.caption}
              </p>

              {/* Accent bar */}
              <div
                className="w-full h-[3px] rounded-full overflow-hidden"
                style={{ background: 'oklch(1 0 0 / 0.08)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(counts[i] / metric.target) * 100}%`,
                    background: `linear-gradient(to right, oklch(0.6 0.14 ${metric.hue}), transparent)`,
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <p
          className="font-mono text-sm text-white/55 tracking-wide"
          style={{
            opacity: active ? 1 : 0,
            transition: 'opacity 0.6s ease 900ms',
          }}
        >
          Total{' '}
          <span className="text-white/90 font-bold text-base">
            {'\u20AC'}
            {total.toFixed(2)}
          </span>
          <span className="text-white/25 mx-2">·</span>
          one-time embedding spend
        </p>
      </div>
    </div>
  )
}
