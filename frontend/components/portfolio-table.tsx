"use client"

import { useState, useMemo } from "react"
import type { Stock } from "@/lib/types"
import { calculateStockMetrics } from "@/lib/calculations"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"

interface PortfolioTableProps {
  stocks: Stock[]
  portfolioPercent?: number
}

const columnHelper = createColumnHelper<Stock>()

export function PortfolioTable({ stocks, portfolioPercent }: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        cell: (info) => (
          <div className="font-medium text-foreground">
            <div className="text-xs sm:text-sm">{info.getValue()}</div>
            <div className="text-xs text-muted-foreground">{info.row.original.symbol}</div>
          </div>
        ),
        header: "Particulars",
      }),
      columnHelper.accessor("purchasePrice", {
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">₹{info.getValue().toFixed(2)}</div>
        ),
        header: "Buy Price",
      }),
      columnHelper.accessor("quantity", {
        cell: (info) => <div className="text-right text-xs sm:text-sm text-foreground">{info.getValue()}</div>,
        header: "Qty",
      }),
      columnHelper.accessor((row) => calculateStockMetrics(row).investment, {
        id: "investment",
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">₹{info.getValue().toFixed(0)}</div>
        ),
        header: "Invest",
      }),
      columnHelper.accessor(
        (row) => {
          const metrics = calculateStockMetrics(row)
          const totalInvestment = stocks.reduce((sum, s) => sum + calculateStockMetrics(s).investment, 0)
          return totalInvestment > 0 ? (metrics.investment / totalInvestment) * 100 : 0
        },
        {
          id: "portfolioPercent",
          cell: (info) => (
            <div className="text-right text-xs sm:text-sm text-foreground">{info.getValue().toFixed(1)}%</div>
          ),
          header: "Port %",
        },
      ),
      columnHelper.accessor("exchange", {
        cell: (info) => (
          <div className="text-center">
            <span className="inline-block px-1.5 sm:px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium">
              {info.getValue()}
            </span>
          </div>
        ),
        header: "Exch",
      }),
      columnHelper.accessor("cmp", {
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">₹{info.getValue().toFixed(2)}</div>
        ),
        header: "CMP",
      }),
      columnHelper.accessor((row) => calculateStockMetrics(row).presentValue, {
        id: "presentValue",
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">₹{info.getValue().toFixed(0)}</div>
        ),
        header: "Present",
      }),
      columnHelper.accessor((row) => calculateStockMetrics(row), {
        id: "gainLoss",
        cell: (info) => {
          const metrics = info.getValue()
          const isGain = metrics.gainLoss >= 0
          return (
            <div
              className={`flex items-center justify-end gap-0.5 sm:gap-1 font-semibold text-xs sm:text-sm ${isGain ? "text-chart-1" : "text-destructive"}`}
            >
              {isGain ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">₹{metrics.gainLoss.toFixed(0)}</span>
              <span className="sm:hidden">₹{(metrics.gainLoss / 1000).toFixed(0)}K</span>
              <span className="text-xs">({metrics.gainLossPercent.toFixed(1)}%)</span>
            </div>
          )
        },
        header: "Gain/Loss",
      }),
      columnHelper.accessor("peRatio", {
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">{info.getValue().toFixed(1)}</div>
        ),
        header: "P/E",
      }),
      columnHelper.accessor("latestEarnings", {
        cell: (info) => (
          <div className="text-right text-xs sm:text-sm text-foreground">₹{(info.getValue() / 100000).toFixed(1)}L</div>
        ),
        header: "Earnings",
      }),
    ],
    [stocks],
  )

  const table = useReactTable({
    data: stocks,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border bg-muted">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors whitespace-nowrap"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="text-xs">
                      {header.column.getIsSorted() === "desc" ? "↓" : header.column.getIsSorted() === "asc" ? "↑" : ""}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-border hover:bg-background/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
