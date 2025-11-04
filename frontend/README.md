# Dynamic Portfolio Dashboard

A modern, real-time portfolio dashboard built with Next.js, TypeScript, React, and Tailwind CSS. Displays live stock market data with dynamic updates, sector analysis, and comprehensive financial metrics.

## Features

- **Real-time Portfolio Tracking**: Automatic price updates every 15 seconds
- **Comprehensive Stock Data**: Purchase price, quantity, CMP, P/E ratio, latest earnings
- **Dynamic Calculations**: Investment, present value, gain/loss with color-coded indicators
- **Sector Grouping**: Organized by sector with aggregate metrics
- **Responsive Design**: Mobile-friendly dashboard that works on all devices
- **Performance Optimized**: Caching, memoization, and efficient data fetching
- **Error Handling**: Graceful error states and loading indicators

## Tech Stack

- **Frontend**: Next.js 16+, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Data Fetching**: Native fetch API with caching
- **State Management**: React hooks (useState, useCallback, useEffect)

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── portfolio/
│   │       ├── stock-price/route.ts    # CMP fetching endpoint
│   │       ├── metrics/route.ts        # P/E Ratio & Earnings endpoint
│   │       └── data/route.ts           # Complete portfolio data endpoint
│   ├── page.tsx                        # Main page
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── components/
│   ├── portfolio-dashboard.tsx         # Main dashboard orchestrator
│   ├── portfolio-table.tsx            # Holdings table component
│   ├── portfolio-summary.tsx          # Summary cards component
│   └── sector-breakdown.tsx           # Sector analysis component
├── lib/
│   ├── types.ts                       # TypeScript interfaces
│   ├── calculations.ts                # Business logic & calculations
│   └── mock-data.ts                   # Sample portfolio data
└── README.md
\`\`\`

## Key Architecture Decisions

### 1. Data Models (types.ts)
Defines clear interfaces for `Stock`, `PortfolioData`, and `SectorSummary`. This ensures type safety and makes the codebase self-documenting.

### 2. Pure Calculation Functions (calculations.ts)
All portfolio metrics are calculated using pure functions that don't have side effects. This makes them:
- Testable: Same input always produces same output
- Reusable: Can be called from multiple places
- Predictable: No hidden dependencies

\`\`\`typescript
// Example: calculateStockMetrics is pure
const metrics = calculateStockMetrics(stock);
// No external dependencies, no state mutations
\`\`\`

### 3. Separation of Concerns
- **Components**: Only handle UI rendering and user interaction
- **API Routes**: Fetch external data and apply caching
- **Calculations**: Compute portfolio metrics
- **Types**: Define data structures

### 4. Real-time Updates Strategy
Uses `setInterval` with a 15-second interval:

\`\`\`typescript
useEffect(() => {
  const interval = setInterval(() => {
    updatePrices();
  }, 15000); // 15 seconds as per requirements
  return () => clearInterval(interval);
}, [updatePrices]);
\`\`\`

### 5. Performance Optimization

**Caching**: API responses are cached to reduce external API calls
\`\`\`typescript
// In route handlers
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  return cached.data;
}
\`\`\`

**Memoization**: Components are optimized to prevent unnecessary re-renders
- Using `useCallback` for stable function references
- Using `useEffect` dependencies carefully

## Addressing Technical Challenges

### 1. API Limitations
**Problem**: Yahoo Finance and Google Finance don't have official public APIs
**Solution**: 
- Mock data with realistic variations for demonstration
- Can be replaced with unofficial libraries (yfinance) or actual APIs
- Implemented caching to manage rate limits

### 2. Real-time Updates
**Problem**: Need to update prices without overwhelming the backend
**Solution**:
- 15-second update interval balances freshness with performance
- Simple in-memory cache prevents duplicate requests
- Can be upgraded to WebSocket for production

### 3. Error Handling
**Problem**: API calls can fail for various reasons
**Solution**:
- Try-catch blocks in all async operations
- Graceful fallbacks (show previous price if update fails)
- User-friendly error messages

### 4. Performance
**Problem**: Large portfolios could be slow to render
**Solution**:
- Component memoization
- Efficient table rendering with stable references
- Calculated values cached between updates

## How It Works

### 1. Initial Load
\`\`\`
User visits dashboard
  → Fetch portfolio data from /api/portfolio/data
  → Calculate totals and sector groupings
  → Render components with initial data
\`\`\`

### 2. Real-time Updates (Every 15 seconds)
\`\`\`
setInterval triggers updatePrices()
  → Fetch latest CMP from /api/portfolio/stock-price
  → Update stock prices in state
  → Recalculate portfolio metrics
  → Re-render with updated values
\`\`\`

### 3. User Interaction
\`\`\`
User clicks "Refresh" button
  → Trigger immediate update
  → Show loading state
  → Fetch fresh data
  → Update display
\`\`\`

## Color Coding System

- **Green**: Positive returns/gains (chart-1 color)
- **Red**: Negative returns/losses (destructive color)

Applied to:
- Gain/Loss values in the table
- Sector performance indicators
- Summary cards

## Responsiveness

Dashboard adapts to screen sizes:
- **Mobile**: Single column, scrollable table
- **Tablet**: 2-column grid for summary cards
- **Desktop**: 4-column grid for summary cards, full table

## Future Enhancements

1. **Database Integration**: Store portfolio in PostgreSQL/Supabase
2. **User Accounts**: Authentication and multi-user portfolios
3. **Real API Integration**: Connect to actual Yahoo Finance/Google Finance
4. **WebSocket Updates**: Real-time push updates instead of polling
5. **Charting**: Add recharts for portfolio value over time
6. **Alerts**: Notify when stocks hit target prices
7. **Export**: CSV/PDF export functionality

## Running Locally

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
\`\`\`

## Understanding the Code

Each component is designed to be understandable:
- Clear variable names
- Comments explaining complex logic
- Separated concerns
- Pure functions where possible

Before an interview, familiarize yourself with:
1. How the calculation functions work
2. The data flow from API to components
3. How real-time updates are triggered
4. Error handling patterns used

## Notes

- Mock data is used for demonstration. Replace with real API calls in production
- The caching strategy is simple (in-memory). Use Redis in production
- No authentication is implemented. Add Supabase auth for multi-user support
