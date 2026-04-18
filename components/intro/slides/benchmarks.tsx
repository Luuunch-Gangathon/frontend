'use client'

import { AmbientGrid } from '../ambient-grid'
import { useCountUp } from '../use-count-up'

// TODO: FILL OUT CORRECT METRICS OR REMOVE SLIDE

const METRICS = [
  {
    target: 98,
    duration: 1200,
    label: 'Compliance classification accuracy',
    caption: 'Grounded in cited EU, US & APAC regulations',
    glyph: '\u2713',
    delay: 150,
  },
  {
    target: 94,
    duration: 1100,
    label: 'Substitution recommendation precision',
    caption: 'Validated against expert sourcing judgment',
    glyph: '\u25ce',
    delay: 300,
  },
  {
    target: 100,
    duration: 900,
    label: 'Decision traceability',
    caption: 'Every answer cites its source document',
    glyph: '\u21b3',
    delay: 450,
  },
]

interface BenchmarksProps {
  active: boolean
  onExit: () => void
}

export function Benchmarks({ active }: BenchmarksProps) {
  const c0 = useCountUp(METRICS[0].target, active, METRICS[0].duration)
  const c1 = useCountUp(METRICS[1].target, active, METRICS[1].duration)
  const c2 = useCountUp(METRICS[2].target, active, METRICS[2].duration)
  const counts = [c0, c1, c2]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <AmbientGrid />

      <div className="relative z-10 flex flex-col items-center gap-16 w-full px-[6%]">
        {/* Headline */}
        <div
          className="text-center"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0ms, transform 0.6s ease 0ms',
          }}
        >
          <p className="text-[12px] uppercase tracking-[0.22em] text-white/35 font-mono mb-3">
            Benchmarks
          </p>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}
          >
            Measured on quality, not hype.
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-12 w-full max-w-5xl">
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
                className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-white/70 text-xl"
                style={{ background: 'oklch(0.28 0.06 264)' }}
              >
                {metric.glyph}
              </div>

              {/* Count-up number */}
              <div
                className="font-mono font-bold text-white leading-none"
                style={{ fontSize: 'clamp(3.8rem, 8.5vw, 7.5rem)' }}
              >
                {counts[i]}%
              </div>

              {/* Label */}
              <p
                className="text-center text-white/40 uppercase tracking-[0.2em]"
                style={{ fontSize: '13px' }}
              >
                {metric.label}
              </p>

              {/* Caption */}
              <p className="text-center text-white/60 text-base leading-snug">{metric.caption}</p>

              {/* Accent bar */}
              <div
                className="w-full h-[3px] rounded-full overflow-hidden"
                style={{ background: 'oklch(1 0 0 / 0.08)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${counts[i]}%`,
                    background: 'linear-gradient(to right, oklch(0.55 0.12 264), transparent)',
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
