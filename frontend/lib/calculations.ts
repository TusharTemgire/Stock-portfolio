// Helper functions to calculate portfolio metrics
// These functions are pure - they don't depend on external state and return consistent results

import type { Stock, PortfolioData, SectorSummary, StockCalculations } from "./types"

/**
 * Calculate individual stock metrics
 * investment = purchasePrice * quantity
 * presentValue = cmp * quantity
 * gainLoss = presentValue - investment
 */
export const calculateStockMetrics = (stock: Stock): StockCalculations => {
  const investment = stock.purchasePrice * stock.quantity
  const presentValue = stock.cmp * stock.quantity
  const gainLoss = presentValue - investment
  const gainLossPercent = investment > 0 ? (gainLoss / investment) * 100 : 0

  return {
    investment,
    presentValue,
    gainLoss,
    gainLossPercent,
    portfolioPercent: 0, // Will be calculated based on total portfolio
  }
}

/**
 * Calculate portfolio totals and percentages
 * This aggregates metrics from all stocks
 */
export const calculatePortfolioTotals = (stocks: Stock[]): PortfolioData => {
  let totalInvestment = 0
  let totalPresentValue = 0

  // Calculate totals
  stocks.forEach((stock) => {
    const metrics = calculateStockMetrics(stock)
    totalInvestment += metrics.investment
    totalPresentValue += metrics.presentValue
  })

  const totalGainLoss = totalPresentValue - totalInvestment
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0

  return {
    stocks,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercent,
    lastRefreshed: Date.now(),
  }
}

/**
 * Group stocks by sector and calculate sector-level summaries
 * This helps investors understand their exposure by sector
 */
export const groupBySector = (stocks: Stock[], totalPortfolioValue: number): SectorSummary[] => {
  const sectorMap = new Map<string, Stock[]>()

  // Group stocks by sector
  stocks.forEach((stock) => {
    const sector = stock.sector || "Other"
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, [])
    }
    sectorMap.get(sector)!.push(stock)
  })

  // Calculate sector summaries
  const summaries: SectorSummary[] = []
  sectorMap.forEach((sectorStocks, sector) => {
    let totalInvestment = 0
    let totalPresentValue = 0

    sectorStocks.forEach((stock) => {
      const metrics = calculateStockMetrics(stock)
      totalInvestment += metrics.investment
      totalPresentValue += metrics.presentValue
    })

    const gainLoss = totalPresentValue - totalInvestment
    const gainLossPercent = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0
    const portfolioPercent = totalPortfolioValue > 0 ? (totalInvestment / totalPortfolioValue) * 100 : 0

    summaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      gainLoss,
      gainLossPercent,
      stocks: sectorStocks,
      portfolioPercent,
    })
  })

  // Sort by total investment (descending)
  return summaries.sort((a, b) => b.totalInvestment - a.totalInvestment)
}

/**
 * Add portfolio percentage to each stock
 * This shows each stock's weight in the total portfolio
 */
export const addPortfolioPercentages = (stocks: Stock[], totalInvestment: number): Stock[] => {
  return stocks.map((stock) => {
    const metrics = calculateStockMetrics(stock)
    return {
      ...stock,
      portfolioPercent: totalInvestment > 0 ? (metrics.investment / totalInvestment) * 100 : 0,
    } as any
  })
}
