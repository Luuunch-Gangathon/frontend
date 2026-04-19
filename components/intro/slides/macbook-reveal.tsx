'use client'

import Image from 'next/image'
import { AmbientGrid } from '../ambient-grid'

interface MacbookRevealProps {
  active: boolean
  zooming: boolean
  onLaunch: () => void
}

export function MacbookReveal({ active, zooming, onLaunch }: MacbookRevealProps) {
  const surroundOpacity = zooming ? 0 : active ? 1 : 0
  const surroundTransform = active && !zooming ? 'translateY(0)' : 'translateY(16px)'
  const surroundTransition = zooming
    ? 'opacity 350ms ease-out'
    : 'opacity 0.7s ease, transform 0.7s ease'

  // Resting tilt (3D perspective) vs zoomed flat scale
  const tilted = 'rotateX(8deg) rotateY(-7deg) rotateZ(-1.5deg) scale(1)'
  const flatZoom = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.6)'

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 px-[6%]">
      <AmbientGrid />

      {/* Eyebrow + headline */}
      <div
        className="text-center z-10"
        style={{
          opacity: surroundOpacity,
          transform: surroundTransform,
          transition: surroundTransition,
        }}
      >
        <p className="text-[clamp(0.85rem,1.6vw,1.15rem)] uppercase tracking-[0.22em] text-white/70 font-medium mb-3">
          Live demo
        </p>
        <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold text-white tracking-tight">
          From insight to action.
        </h2>
      </div>

      {/* Floating screenshot */}
      <div
        className="relative z-10"
        style={{
          width: 'clamp(680px, 76vw, 1120px)',
          perspective: '2000px',
          perspectiveOrigin: 'center 40%',
        }}
      >
        {/* Shiny shadow glow underneath */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            bottom: '-40px',
            width: '78%',
            height: '110px',
            background:
              'radial-gradient(ellipse at center, oklch(0.55 0.15 264 / 0.55) 0%, oklch(0.5 0.12 220 / 0.25) 35%, transparent 70%)',
            filter: 'blur(28px)',
            opacity: zooming ? 0 : 1,
            transition: 'opacity 350ms ease-out',
            zIndex: -1,
          }}
        />

        {/* Tilted + floating wrapper */}
        <div
          style={{
            transform: zooming ? flatZoom : tilted,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            transition: zooming
              ? 'transform 800ms cubic-bezier(0.65, 0, 0.35, 1)'
              : 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            animation:
              active && !zooming ? 'floatScreenshot 7s ease-in-out infinite' : 'none',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: '14px',
              boxShadow: `
                0 40px 80px -30px oklch(0 0 0 / 0.7),
                0 20px 60px -20px oklch(0.55 0.15 264 / 0.35),
                inset 0 0 0 1px oklch(1 0 0 / 0.08)
              `,
            }}
            onClick={(e) => {
              e.stopPropagation()
              onLaunch()
            }}
          >
            <Image
              src="/app.png"
              alt="Spherecast app"
              width={1800}
              height={1125}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />

            {/* Gloss sheen overlay */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, oklch(1 0 0 / 0.14) 0%, oklch(1 0 0 / 0) 28%, oklch(1 0 0 / 0) 72%, oklch(1 0 0 / 0.06) 100%)',
                opacity: zooming ? 0 : 1,
                transition: 'opacity 350ms ease-out',
              }}
            />

            {/* Subtle top highlight */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 pointer-events-none"
              style={{
                height: '50%',
                background:
                  'linear-gradient(to bottom, oklch(1 0 0 / 0.08) 0%, transparent 100%)',
                opacity: zooming ? 0 : 1,
                transition: 'opacity 350ms ease-out',
              }}
            />
          </div>
        </div>
      </div>

      {/* Hint */}
      <p
        className="absolute bottom-8 text-sm text-white/55 z-10 pb-12"
        style={{
          opacity: surroundOpacity,
          transition: zooming ? 'opacity 350ms ease-out' : 'opacity 0.7s ease 0.7s',
          animation: active && !zooming ? 'pulseSoft 2.5s ease-in-out infinite' : 'none',
        }}
      >
        Press → or click to enter
      </p>
    </div>
  )
}
