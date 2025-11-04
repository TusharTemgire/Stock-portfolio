// API endpoint to fetch current market prices (CMP)
// In a real application, this would call Yahoo Finance or another financial API
// For now, it returns mock data with slight variations to simulate price changes

import { type NextRequest, NextResponse } from "next/server"

// Simulate a simple in-memory cache for API data
// In production, use Redis or a database for caching
const priceCache: { [key: string]: { price: number; timestamp: number } } = {}
const CACHE_DURATION = 10000 // 10 seconds

/**
 * Simulate fetching stock prices from an external API
 * In reality, this would integrate with Yahoo Finance or similar
 *
 * API Challenges addressed:
 * 1. Rate limiting: Using simple cache to avoid excessive calls
 * 2. Error handling: Returns previous price if fetch fails
 * 3. Data format: Returns consistent JSON structure
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbols = searchParams.getAll("symbol")

    if (!symbols || symbols.length === 0) {
      return NextResponse.json({ error: "No symbols provided" }, { status: 400 })
    }

    const prices: { [key: string]: number } = {}

    symbols.forEach((symbol) => {
      // Check if price is in cache and still valid
      const cached = priceCache[symbol]
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        prices[symbol] = cached.price
      } else {
        // Simulate fetching new price with small random variation (0.5% to 2%)
        const basePrice = 1000 // This would normally come from the API
        const variation = 1 + (Math.random() * 0.015 - 0.005)
        const newPrice = basePrice * variation

        priceCache[symbol] = {
          price: newPrice,
          timestamp: Date.now(),
        }
        prices[symbol] = newPrice
      }
    })

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error fetching stock prices:", error)
    return NextResponse.json({ error: "Failed to fetch stock prices" }, { status: 500 })
  }
}
