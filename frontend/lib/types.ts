// Type definitions for the portfolio dashboard
// This file defines all the TypeScript interfaces used throughout the application

export interface Stock {
  id: string
  name: string
  symbol: string
  sector: string
  exchange: "NSE" | "BSE"
  purchasePrice: number
  quantity: number
  cmp: number
  peRatio: number
  latestEarnings: number
  lastUpdated: number
}

export interface PortfolioData {
  stocks: Stock[]
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  lastRefreshed: number
}

export interface SectorSummary {
  sector: string
  totalInvestment: number
  totalPresentValue: number
  gainLoss: number
  gainLossPercent: number
  stocks: Stock[]
  portfolioPercent: number
}

export interface StockCalculations {
  investment: number
  presentValue: number
  gainLoss: number
  gainLossPercent: number
  portfolioPercent: number
}
