import type { ReactNode } from 'react'

interface MacbookFrameProps {
  children: ReactNode
  zooming: boolean
}

export function MacbookFrame({ children, zooming }: MacbookFrameProps) {
  const chassisOpacity = zooming ? 0 : 1

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: 'clamp(520px, 65vw, 880px)' }}
    >
      {/* Ambient drop shadow */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '88%',
          height: '56px',
          background: 'radial-gradient(ellipse, oklch(0 0 0 / 0.55) 0%, transparent 65%)',
          filter: 'blur(18px)',
          opacity: chassisOpacity,
          transition: 'opacity 350ms ease-out',
          zIndex: -1,
        }}
      />

      {/* Lid */}
      <div
        className="relative w-full"
        style={{
          background: 'linear-gradient(180deg, oklch(0.24 0 0) 0%, oklch(0.14 0 0) 100%)',
          padding: '9px 9px 11px 9px',
          borderRadius: '14px',
          boxShadow: `
            inset 0 0 0 0.5px oklch(1 0 0 / 0.12),
            inset 0 1px 0 oklch(1 0 0 / 0.08),
            inset 0 -2px 4px oklch(0 0 0 / 0.4),
            0 1px 0 oklch(0 0 0 / 0.5)
          `,
          aspectRatio: '16 / 10',
        }}
      >
        {/* Notch */}
        <div
          className="absolute z-10 flex items-center justify-center"
          style={{
            top: '9px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '138px',
            height: '15px',
            background: 'oklch(0.05 0 0)',
            borderRadius: '0 0 10px 10px',
            opacity: chassisOpacity,
            transition: 'opacity 350ms ease-out',
          }}
        >
          {/* Camera lens */}
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'oklch(0.12 0 0)',
              boxShadow: 'inset 0 0 0 0.5px oklch(0.2 0 0)',
            }}
          />
        </div>

        {/* Screen well — zooms out during transition */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '5px',
            overflow: 'hidden',
            position: 'relative',
            transform: zooming ? 'scale(5)' : 'scale(1)',
            transformOrigin: 'center center',
            transition: zooming
              ? 'transform 700ms cubic-bezier(0.65, 0, 0.35, 1)'
              : 'transform 0ms',
          }}
        >
          {/* Screen glare */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(155deg, oklch(1 0 0 / 0.06) 0%, transparent 32%, transparent 68%, oklch(1 0 0 / 0.025) 100%)',
              opacity: chassisOpacity,
              transition: 'opacity 350ms ease-out',
            }}
          />
          {children}
        </div>
      </div>

      {/* Hinge seam */}
      <div
        className="relative"
        style={{
          width: '100%',
          height: '7px',
          marginTop: '-1px',
          background:
            'linear-gradient(180deg, oklch(0.1 0 0) 0%, oklch(0.16 0 0) 50%, oklch(0.22 0 0) 100%)',
          borderRadius: '0 0 3px 3px',
          boxShadow: 'inset 0 1px 0 oklch(0 0 0 / 0.4)',
          opacity: chassisOpacity,
          transition: 'opacity 350ms ease-out',
        }}
      />

      {/* Base (trapezoid) */}
      <div
        className="relative"
        style={{
          width: '98%',
          height: '12px',
          clipPath: 'polygon(1.2% 0, 98.8% 0, 100% 100%, 0% 100%)',
          background:
            'linear-gradient(180deg, oklch(0.68 0 0) 0%, oklch(0.54 0 0) 38%, oklch(0.38 0 0) 100%)',
          opacity: chassisOpacity,
          transition: 'opacity 350ms ease-out',
        }}
      />

      {/* Base front lip (dark underside) */}
      <div
        style={{
          width: '45%',
          height: '2px',
          background: 'oklch(0.18 0 0)',
          borderRadius: '0 0 3px 3px',
          opacity: chassisOpacity,
          transition: 'opacity 350ms ease-out',
        }}
      />
    </div>
  )
}
