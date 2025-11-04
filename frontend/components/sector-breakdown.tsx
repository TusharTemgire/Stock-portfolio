"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SectorSummary } from "@/lib/types"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { PortfolioTable } from "./portfolio-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SectorBreakdownProps {
  sectors: SectorSummary[]
}

export function SectorBreakdown({ sectors }: SectorBreakdownProps) {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set())

  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors)
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector)
    } else {
      newExpanded.add(sector)
    }
    setExpandedSectors(newExpanded)
  }

  const chartData = sectors.map((sector) => ({
    name: sector.sector.length > 10 ? sector.sector.substring(0, 10) + "..." : sector.sector,
    investment: sector.totalInvestment,
    presentValue: sector.totalPresentValue,
    gainLoss: Math.max(0, sector.gainLoss),
  }))

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Sector Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--color-muted-foreground))"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--color-muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--color-card))",
                  border: "1px solid hsl(var(--color-border))",
                  borderRadius: "6px",
                  color: "hsl(var(--color-foreground))",
                  fontSize: "12px",
                }}
                formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="investment" fill="hsl(var(--color-chart-1))" name="Investment" />
              <Bar dataKey="presentValue" fill="hsl(var(--color-chart-2))" name="Present Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {sectors.map((sector) => {
          const isExpanded = expandedSectors.has(sector.sector)
          const isGain = sector.gainLoss >= 0

          return (
            <Card key={sector.sector} className="overflow-hidden bg-card border-border">
              <button onClick={() => toggleSector(sector.sector)} className="w-full text-left">
                <CardHeader className="pb-2 sm:pb-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform text-foreground ${isExpanded ? "transform rotate-180" : ""}`}
                      />
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-base text-foreground truncate">{sector.sector}</CardTitle>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {sector.stocks.length} stock{sector.stocks.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-xs sm:text-base text-foreground">
                        {sector.portfolioPercent.toFixed(1)}%
                      </div>
                      <div className={`text-xs sm:text-sm font-medium ${isGain ? "text-chart-1" : "text-destructive"}`}>
                        {isGain ? "+" : ""}
                        {sector.gainLossPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3 sm:space-y-4 border-t border-border pt-3 sm:pt-4">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Total Invest</div>
                        <div className="text-sm sm:text-lg font-semibold text-foreground">
                          ₹{(sector.totalInvestment / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Present Val</div>
                        <div className="text-sm sm:text-lg font-semibold text-foreground">
                          ₹{(sector.totalPresentValue / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Gain/Loss</div>
                        <div
                          className={`text-sm sm:text-lg font-semibold ${isGain ? "text-chart-1" : "text-destructive"}`}
                        >
                          ₹{(sector.gainLoss / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border overflow-x-auto">
                      <PortfolioTable stocks={sector.stocks} portfolioPercent={0} />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
