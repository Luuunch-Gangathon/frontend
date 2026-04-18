"use client"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip,
} from "recharts"
import { parseSavingsUsd, parseTimelineWeeks } from "@/lib/opportunity-metrics"
import type { Opportunity } from "@/lib/demo-data"

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981"]

interface CompareRadarProps {
  opportunities: Opportunity[]
}

function normalize(values: number[]): number[] {
  const max = Math.max(...values)
  if (max === 0) return values.map(() => 0)
  return values.map((v) => Math.round((v / max) * 100))
}

export function CompareRadar({ opportunities }: CompareRadarProps) {
  const savingsRaw = opportunities.map((o) => parseSavingsUsd(o.estimated_impact))
  const timelineRaw = opportunities.map((o) => parseTimelineWeeks(o.conservative.timeline))
  const companiesRaw = opportunities.map((o) => o.companies_involved.length)
  const skusRaw = opportunities.map((o) => o.conservative.affected_skus.length)
  const fragRaw = opportunities.map((o) => o.fragmentation_score)
  // For timeline, lower = better. Invert for radar.
  const maxTimeline = Math.max(...timelineRaw)
  const timelineInv = timelineRaw.map((t) => (maxTimeline > 0 ? maxTimeline - t : 0))

  const savingsNorm = normalize(savingsRaw)
  const timelineNorm = normalize(timelineInv)
  const companiesNorm = normalize(companiesRaw)
  const skusNorm = normalize(skusRaw)
  const fragNorm = normalize(fragRaw)

  const axes = ["Savings", "Speed", "Companies", "SKUs", "Fragmentation"]
  const dataPoints = axes.map((axis, ai) => {
    const entry: Record<string, string | number> = { axis }
    opportunities.forEach((opp, oi) => {
      const vals = [savingsNorm, timelineNorm, companiesNorm, skusNorm, fragNorm]
      entry[opp.headline.split(" ").slice(0, 3).join(" ")] = vals[ai][oi]
    })
    return entry
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold mb-4">Normalized comparison radar</h3>
      <p className="text-xs text-muted-foreground mb-3">All axes normalized to 0–100. Speed = inverse of timeline (higher = faster).</p>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={dataPoints}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
          {opportunities.map((opp, i) => (
            <Radar
              key={opp.id}
              name={opp.headline.split(" ").slice(0, 3).join(" ")}
              dataKey={opp.headline.split(" ").slice(0, 3).join(" ")}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
