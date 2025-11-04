// API endpoint to get complete portfolio data with all calculations
// This is the main endpoint that the frontend will call

import { NextResponse } from "next/server"
import { mockPortfolioData } from "@/lib/mock-data"
import { calculatePortfolioTotals, groupBySector } from "@/lib/calculations"

export async function GET() {
  try {
    // In a real application, fetch from database
    const stocks = mockPortfolioData

    // Calculate all metrics
    const portfolioData = calculatePortfolioTotals(stocks)
    const sectorSummaries = groupBySector(stocks, portfolioData.totalInvestment)

    return NextResponse.json({
      success: true,
      data: {
        stocks,
        portfolio: portfolioData,
        sectors: sectorSummaries,
      },
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 })
  }
}
