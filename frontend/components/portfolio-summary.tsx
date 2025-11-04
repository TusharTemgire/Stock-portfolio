"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioData } from "@/lib/types"
import { TrendingUp, TrendingDown } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PortfolioSummaryProps {
  data: PortfolioData
}

export function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const isGain = data.totalGainLoss >= 0

  const pieData = [
    { name: "Investment", value: data.totalInvestment },
    { name: "Gain/Loss", value: Math.abs(data.totalGainLoss) },
  ]

  const COLORS = isGain
    ? ["hsl(var(--color-chart-2))", "hsl(var(--color-chart-1))"]
    : ["hsl(var(--color-chart-2))", "hsl(var(--color-destructive))"]

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              ₹{(data.totalInvestment / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
              {data.totalInvestment > 0 ? "Active holdings" : "No holdings"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Present Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              ₹{(data.totalPresentValue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground mt-1 sm:mt-2">Market value today</p>
          </CardContent>
        </Card>

        <Card className={`bg-card border-border ${isGain ? "border-chart-1/20" : "border-destructive/20"}`}>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-1 sm:gap-2 ${isGain ? "text-chart-1" : "text-destructive"}`}
            >
              {isGain ? (
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              ₹{(Math.abs(data.totalGainLoss) / 100000).toFixed(1)}L
            </div>
            <div
              className={`text-xs sm:text-sm mt-1 sm:mt-2 font-semibold ${isGain ? "text-chart-1" : "text-destructive"}`}
            >
              {isGain ? "+" : ""}
              {data.totalGainLossPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              {new Date(data.lastRefreshed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-xs text-muted-foreground mt-1 sm:mt-2">Live data</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Portfolio Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ₹${(value / 100000).toFixed(0)}L (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(2)}L`} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
