"use client"

import { PortfolioDashboard } from "@/components/portfolio-dashboard"

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Real-time portfolio performance and sector analysis
        </p>
      </div>

      {/* Dashboard Content */}
      <PortfolioDashboard />
    </div>
  )
}
