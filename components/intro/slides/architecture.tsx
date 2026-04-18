'use client'

import { useState, useEffect } from 'react'
import { AmbientGrid } from '../ambient-grid'

const TOOLS = [
  { label: 'SearchEngine', dot: 'oklch(0.65 0.15 220)' },
  { label: 'ComplianceEngine', dot: 'oklch(0.60 0.14 240)' },
  { label: 'QueryMaterialEngine', dot: 'oklch(0.58 0.13 260)' },
  { label: 'ProductBomEngine', dot: 'oklch(0.55 0.12 280)' },
  { label: 'CompanyEngine', dot: 'oklch(0.52 0.11 200)' },
]

// SVG / absolute coordinate space: 940 × 400
const AGNES_CX = 365
const AGNES_CY = 182
const AGNES_R = 82

const TOOL_X = 668
const TOOL_TOPS = [20, 92, 164, 236, 308]
const TOOL_CY = TOOL_TOPS.map((t) => t + 23)

const FE_RIGHT = 150
const FE_CY = 182

const OAI_CX = 294
const OAI_CY = 354
const MEM_CX = 436
const MEM_CY = 354

interface ArchitectureProps {
  active: boolean
  onExit: () => void
}

export function Architecture({ active }: ArchitectureProps) {
  const [dotsActive, setDotsActive] = useState(false)

  useEffect(() => {
    if (!active) {
      setDotsActive(false)
      return
    }
    const t = setTimeout(() => setDotsActive(true), 1400)
    return () => clearTimeout(t)
  }, [active])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 px-[4%]">
      <AmbientGrid />

      {/* Headline */}
      <div
        className="relative z-10 text-center"
        style={{
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0ms, transform 0.5s ease 0ms',
        }}
      >
        <h2
          className="font-bold text-white"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          The Planning Agent.
        </h2>
        <p className="text-white/45 text-lg mt-2">Agnes orchestrates five specialized tools.</p>
      </div>

      {/* Diagram */}
      <div className="relative z-10" style={{ width: '940px', maxWidth: '92vw', height: '400px' }}>
        {/* SVG connection lines */}
        <svg
          viewBox="0 0 940 400"
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="oklch(1 0 0 / 0.3)" />
            </marker>
          </defs>

          {/* FrontEnd → Agnes (with arrow) */}
          <line
            x1={FE_RIGHT}
            y1={FE_CY}
            x2={AGNES_CX - AGNES_R}
            y2={AGNES_CY}
            stroke="oklch(1 0 0 / 0.25)"
            strokeWidth={1}
            fill="none"
            markerEnd="url(#arr)"
            strokeDasharray={300}
            strokeDashoffset={active ? 0 : 300}
            style={{ transition: 'stroke-dashoffset 0.4s ease 500ms' }}
          />

          {/* Agnes → each tool */}
          {TOOL_CY.map((cy, i) => (
            <line
              key={i}
              x1={AGNES_CX + AGNES_R}
              y1={AGNES_CY}
              x2={TOOL_X}
              y2={cy}
              stroke="oklch(1 0 0 / 0.18)"
              strokeWidth={1}
              fill="none"
              strokeDasharray={300}
              strokeDashoffset={active ? 0 : 300}
              style={{ transition: `stroke-dashoffset 0.45s ease ${600 + i * 100}ms` }}
            />
          ))}

          {/* Agnes → OpenAI (dashed, opacity only) */}
          <line
            x1={AGNES_CX}
            y1={AGNES_CY + AGNES_R}
            x2={OAI_CX}
            y2={OAI_CY - 20}
            stroke="oklch(1 0 0 / 0.12)"
            strokeWidth={1}
            fill="none"
            strokeDasharray="4 4"
            style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }}
          />

          {/* Agnes → Memory (dashed, opacity only) */}
          <line
            x1={AGNES_CX}
            y1={AGNES_CY + AGNES_R}
            x2={MEM_CX}
            y2={MEM_CY - 20}
            stroke="oklch(1 0 0 / 0.12)"
            strokeWidth={1}
            fill="none"
            strokeDasharray="4 4"
            style={{ opacity: active ? 1 : 0, transition: 'opacity 0.4s ease 400ms' }}
          />

          {/* Flow dots */}
          {dotsActive && (
            <>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.8">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="0s"
                  path={`M ${FE_RIGHT} ${FE_CY} L ${AGNES_CX - AGNES_R} ${AGNES_CY}`}
                />
              </circle>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.7">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="0.7s"
                  path={`M ${AGNES_CX + AGNES_R} ${AGNES_CY} L ${TOOL_X} ${TOOL_CY[0]}`}
                />
              </circle>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.7">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="1.4s"
                  path={`M ${AGNES_CX + AGNES_R} ${AGNES_CY} L ${TOOL_X} ${TOOL_CY[2]}`}
                />
              </circle>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.7">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="2.1s"
                  path={`M ${AGNES_CX + AGNES_R} ${AGNES_CY} L ${TOOL_X} ${TOOL_CY[1]}`}
                />
              </circle>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.7">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="2.8s"
                  path={`M ${AGNES_CX + AGNES_R} ${AGNES_CY} L ${TOOL_X} ${TOOL_CY[3]}`}
                />
              </circle>
              <circle r="2.5" fill="oklch(0.65 0.12 264)" opacity="0.7">
                <animateMotion
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin="3.5s"
                  path={`M ${AGNES_CX + AGNES_R} ${AGNES_CY} L ${TOOL_X} ${TOOL_CY[4]}`}
                />
              </circle>
            </>
          )}
        </svg>

        {/* FrontEnd node */}
        <div
          className="absolute flex items-center justify-center rounded-lg border border-white/10"
          style={{
            left: 22,
            top: 160,
            width: 128,
            height: 44,
            background: 'oklch(0.12 0 0)',
            opacity: active ? 1 : 0,
            transform: active ? 'translateX(0)' : 'translateX(-16px)',
            transition: 'opacity 0.5s ease 500ms, transform 0.5s ease 500ms',
          }}
        >
          <span className="font-mono text-sm text-white/55">FrontEnd</span>
        </div>

        {/* Agnes node */}
        <div
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{
            left: AGNES_CX - AGNES_R,
            top: AGNES_CY - AGNES_R,
            width: AGNES_R * 2,
            height: AGNES_R * 2,
            background:
              'radial-gradient(circle, oklch(0.35 0.15 264) 0%, oklch(0.15 0.05 264) 100%)',
            boxShadow: active
              ? '0 0 60px oklch(0.4 0.15 264 / 0.5), 0 0 20px oklch(0.35 0.15 264 / 0.3)'
              : '0 0 0px transparent',
            opacity: active ? 1 : 0,
            transform: active ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.4s ease 200ms, transform 0.4s ease 200ms',
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-mono">
            Planning Agent
          </p>
          <p className="font-bold text-white text-lg tracking-tight">Agnes</p>
        </div>

        {/* Tool pills */}
        {TOOLS.map((tool, i) => (
          <div
            key={tool.label}
            className="absolute flex items-center gap-3 rounded-lg border border-white/8 px-4"
            style={{
              left: TOOL_X,
              top: TOOL_TOPS[i],
              width: 248,
              height: 46,
              background: 'oklch(0.12 0 0)',
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(16px)',
              transition: `opacity 0.5s ease ${600 + i * 100}ms, transform 0.5s ease ${600 + i * 100}ms`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: tool.dot }}
            />
            <span className="font-mono text-[13px] text-white/60">{tool.label}</span>
          </div>
        ))}

        {/* OpenAI node */}
        <div
          className="absolute flex items-center justify-center rounded-lg border border-white/8"
          style={{
            left: 232,
            top: 334,
            width: 124,
            height: 40,
            background: 'oklch(0.10 0 0)',
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease 400ms, transform 0.5s ease 400ms',
          }}
        >
          <span className="font-mono text-[13px] text-white/35">OpenAI</span>
        </div>

        {/* Memory node */}
        <div
          className="absolute flex items-center justify-center rounded-lg border border-white/8"
          style={{
            left: 374,
            top: 334,
            width: 124,
            height: 40,
            background: 'oklch(0.10 0 0)',
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease 400ms, transform 0.5s ease 400ms',
          }}
        >
          <span className="font-mono text-[13px] text-white/35">Memory</span>
        </div>
      </div>
    </div>
  )
}
