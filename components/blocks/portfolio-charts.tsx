"use client"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, PieChart, Pie, Legend,
} from "recharts"
import {
  getRmSupplierCounts,
  getCompanyOverlapMatrix,
  getScatterData,
  getSupplierConcentration,
} from "@/lib/opportunity-metrics"

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6",
  "#ef4444", "#06b6d4", "#84cc16", "#f97316",
  "#ec4899", "#6366f1",
]

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  )
}

function RmFragmentationChart() {
  const data = getRmSupplierCounts()
  return (
    <ChartCard title="Raw material supplier fragmentation">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 48, left: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            label={{ value: "Suppliers", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--muted-foreground)", dx: 10 }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
            formatter={(v) => [v, "Suppliers"]}
          />
          <Bar dataKey="supplierCount" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={entry.rmId}
                fill={entry.rmId === "rm-mag-stearate" ? "#ef4444" : COLORS[i % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function CompanyOverlapHeatmap() {
  const { companies, matrix } = getCompanyOverlapMatrix()
  const maxVal = Math.max(...matrix.flat().filter((v) => v >= 0))

  return (
    <ChartCard title="Cross-company raw material overlap">
      <div className="overflow-auto">
        <table className="text-xs border-collapse min-w-full">
          <thead>
            <tr>
              <th className="w-20" />
              {companies.map((c) => (
                <th
                  key={c.id}
                  className="text-center font-medium text-muted-foreground pb-1 px-0.5"
                  style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", height: 68, verticalAlign: "bottom" }}
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((rowCo, ri) => (
              <tr key={rowCo.id}>
                <td className="text-right pr-2 text-muted-foreground font-medium py-0.5 whitespace-nowrap">{rowCo.name}</td>
                {companies.map((colCo, ci) => {
                  const val = matrix[ri][ci]
                  if (val === -1) {
                    return <td key={colCo.id} className="w-7 h-7 bg-muted/40 border border-border/30" />
                  }
                  const intensity = maxVal > 0 ? val / maxVal : 0
                  const bg = `rgba(59,130,246,${intensity * 0.85 + (intensity > 0 ? 0.1 : 0)})`
                  return (
                    <td
                      key={colCo.id}
                      className="w-7 h-7 text-center border border-border/30 font-medium"
                      style={{ background: bg, color: intensity > 0.5 ? "#fff" : "var(--foreground)" }}
                      title={`${rowCo.name} ↔ ${colCo.name}: ${val} shared materials`}
                    >
                      {val > 0 ? val : ""}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}

function OpportunityScatter() {
  const data = getScatterData()
  return (
    <ChartCard title="Opportunity: impact vs. timeline">
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
          <XAxis
            dataKey="x"
            type="number"
            name="Timeline"
            unit="w"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            label={{ value: "Timeline (weeks)", position: "insideBottom", offset: -16, fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Savings"
            tickFormatter={(v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <ZAxis dataKey="z" range={[60, 260]} name="Companies" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
            formatter={(value, name) => {
              if (name === "Savings") {
                const v = value as number
                return [v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}k`, name]
              }
              if (name === "Timeline") return [`${value}w`, name]
              if (name === "Companies") return [value, name]
              return [value, name]
            }}
          />
          <Scatter
            data={data}
            fill="#3b82f6"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.kind === "consolidate" ? "#3b82f6" : "#8b5cf6"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-1 text-xs text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-blue-500" />Consolidate</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-purple-500" />Substitute</span>
        <span className="text-muted-foreground/70">Bubble size = companies involved</span>
      </div>
    </ChartCard>
  )
}

function SupplierDonut() {
  const data = getSupplierConcentration()
  return (
    <ChartCard title="Supplier BOM concentration">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={76}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 6 }}
            formatter={(v) => [v, "BOMs supplied"]}
          />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function PortfolioCharts() {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Portfolio analytics</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RmFragmentationChart />
        <CompanyOverlapHeatmap />
        <OpportunityScatter />
        <SupplierDonut />
      </div>
    </div>
  )
}
