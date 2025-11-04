"use client"

import { useState, useEffect, useCallback } from "react"
import type { PortfolioData, SectorSummary, Stock } from "@/lib/types"
import { PortfolioSummary } from "./portfolio-summary"
import { PortfolioTable } from "./portfolio-table"
import { SectorBreakdown } from "./sector-breakdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePortfolioTotals, groupBySector } from "@/lib/calculations"
import { AlertCircle, RefreshCw } from "lucide-react"

export function PortfolioDashboard() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [sectors, setSectors] = useState<SectorSummary[]>([])
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0)

  const fetchPortfolioData = useCallback(async () => {
    try {
      const response = await fetch("/api/portfolio/data")
      if (!response.ok) throw new Error("Failed to fetch portfolio data")

      const json = await response.json()
      if (!json.success) throw new Error(json.error || "Failed to fetch data")

      const { stocks: fetchedStocks, portfolio, sectors: fetchedSectors } = json.data

      setStocks(fetchedStocks)
      setPortfolioData(portfolio)
      setSectors(fetchedSectors)
      setError(null)
    } catch (err) {
      console.error("Error fetching portfolio:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio data")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  const updatePrices = useCallback(async () => {
    if (stocks.length === 0) return

    try {
      const symbols = stocks.map((s) => s.symbol)
      const response = await fetch(`/api/portfolio/stock-price?${symbols.map((s) => `symbol=${s}`).join("&")}`)

      if (response.ok) {
        const json = await response.json()
        const updatedPrices = json.data

        const updatedStocks = stocks.map((stock) => ({
          ...stock,
          cmp: updatedPrices[stock.symbol] || stock.cmp,
          lastUpdated: Date.now(),
        }))

        setStocks(updatedStocks)

        const updatedPortfolio = calculatePortfolioTotals(updatedStocks)
        const updatedSectors = groupBySector(updatedStocks, updatedPortfolio.totalInvestment)

        setPortfolioData(updatedPortfolio)
        setSectors(updatedSectors)
        setLastUpdateTime(Date.now())
      }
    } catch (err) {
      console.error("Error updating prices:", err)
    }
  }, [stocks])

  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices()
    }, 15000)

    return () => clearInterval(interval)
  }, [updatePrices])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchPortfolioData()
    await updatePrices()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 animate-spin text-primary" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">Error Loading Portfolio</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!portfolioData) {
    return null
  }

  const stocksWithPercentages = stocks.map((stock) => ({
    ...stock,
    portfolioPercent: ((stock.purchasePrice * stock.quantity) / portfolioData.totalInvestment) * 100,
  }))

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Portfolio Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track your investments in real-time</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          <span className="sm:hidden">{isRefreshing ? "..." : "Refresh"}</span>
        </button>
      </div>

      {/* Portfolio Summary Cards - Responsive grid */}
      <div>
        <PortfolioSummary data={portfolioData} />
      </div>

      {/* Holdings Table - Responsive container */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-full">
            <PortfolioTable stocks={stocksWithPercentages} />
          </div>
        </CardContent>
      </Card>

      {/* Sector Breakdown - Responsive grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Sector Analysis</h2>
        <SectorBreakdown sectors={sectors} />
      </div>

      {/* Footer with last update time */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground border-t border-border pt-6">
        <p>Last updated: {new Date(portfolioData.lastRefreshed).toLocaleString()}</p>
        {lastUpdateTime > 0 && <p className="mt-1">Price data updates every 15 seconds</p>}
      </div>
    </div>
  )
}
