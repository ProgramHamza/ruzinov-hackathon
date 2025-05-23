"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", cost: 5200, savings: 800 },
  { month: "Feb", cost: 4800, savings: 1200 },
  { month: "Mar", cost: 4600, savings: 1400 },
  { month: "Apr", cost: 4400, savings: 1600 },
  { month: "May", cost: 4200, savings: 1800 },
  { month: "Jun", cost: 4000, savings: 2000 },
]

export function CostAnalysisChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stackId="1"
            stroke="#ef4444"
            fill="url(#costGradient)"
            name="Operating Cost"
          />
          <Area
            type="monotone"
            dataKey="savings"
            stackId="2"
            stroke="#10b981"
            fill="url(#savingsGradient)"
            name="Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
