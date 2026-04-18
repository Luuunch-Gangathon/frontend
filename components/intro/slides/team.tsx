'use client'

import Image from 'next/image'
import { AmbientGrid } from '../ambient-grid'

const TEAM_PHOTO = '/team.jpg'

const NAMES = ['Mikhail', 'Amir', 'Roman', 'Bohdan', 'Kirill']

interface TeamProps {
  active: boolean
  onExit: () => void
}

export function Team({ active }: TeamProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-10 px-[6%]">
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
        <p className="text-[12px] uppercase tracking-[0.22em] text-white/65 font-mono mb-3">
          The Team
        </p>
        <h2 className="font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
          Built by the Luuunch Gang.
        </h2>
      </div>

      {/* Group photo */}
      <div
        className="relative z-10 w-full overflow-hidden rounded-2xl"
        style={{
          maxWidth: '860px',
          aspectRatio: '16 / 9',
          boxShadow:
            '0 0 0 1px oklch(1 0 0 / 0.08), 0 30px 60px -20px oklch(0 0 0 / 0.7)',
          background: 'oklch(0.14 0 0)',
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'opacity 0.65s ease 150ms, transform 0.65s ease 150ms',
        }}
      >
        <Image
          src={TEAM_PHOTO}
          alt="The team"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Names */}
      <div className="relative z-10 flex items-center gap-8 flex-wrap justify-center">
        {NAMES.map((name, i) => (
          <p
            key={name}
            className="font-bold text-white text-xl tracking-tight"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.5s ease ${400 + i * 90}ms, transform 0.5s ease ${400 + i * 90}ms`,
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  )
}
