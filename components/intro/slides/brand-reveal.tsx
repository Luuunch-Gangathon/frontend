import { AmbientGrid } from '../ambient-grid'

interface BrandRevealProps {
  active: boolean
  onExit: () => void
}

export function BrandReveal(_props: BrandRevealProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <AmbientGrid />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-[clamp(4rem,10vw,9rem)] font-bold tracking-tight text-white leading-none">
          <span className="inline-block anim-rise">Sphere</span>
          <span className="inline-block anim-rise anim-rise-delay-2 text-white/60">cast</span>
        </div>

        <p className="text-[clamp(0.85rem,1.6vw,1.15rem)] text-white/35 tracking-[0.35em] uppercase anim-rise anim-rise-delay-4">
          Supply Chain Co-Pilot
        </p>
      </div>

      <p
        className="absolute bottom-20 text-sm text-white/25"
        style={{
          animation:
            'riseIn 0.7s cubic-bezier(0.16,1,0.3,1) 880ms both, pulseSoft 2.5s ease-in-out 2s infinite',
        }}
      >
        Press → to continue
      </p>
    </div>
  )
}
