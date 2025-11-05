'use client';

import { useEffect, useState } from 'react';
import { fetchHoldings, fetchBatchPrices } from '@/lib/api';
import { Holding, PortfolioStock, SectorSummary } from '@/lib/portfolio-types';
import {
  calculatePortfolio,
  calculatePortfolioPercents,
  groupBySector,
  formatCurrency,
  formatPercent,
} from '@/lib/portfolio-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PortfolioCharts from './portfolio-charts';

export default function PortfolioDashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadHoldings = async () => {
    try {
      const data = await fetchHoldings();
      setHoldings(data);
    } catch (err) {
      setError('Failed to load holdings');
    }
  };

  const updatePrices = async () => {
    if (holdings.length === 0) return;

    try {
      const prices = await fetchBatchPrices(holdings);
      const calculatedPortfolio = calculatePortfolio(holdings, prices);
      const withPercents = calculatePortfolioPercents(calculatedPortfolio);
      const groupedSectors = groupBySector(withPercents);

      setPortfolio(withPercents);
      setSectors(groupedSectors);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to update prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  useEffect(() => {
    if (holdings.length > 0) {
      updatePrices();
      const interval = setInterval(updatePrices, 15000);
      return () => clearInterval(interval);
    }
  }, [holdings]);

  const totalInvestment = portfolio.reduce((sum, s) => sum + s.investment, 0);
  const totalPresentValue = portfolio.reduce((sum, s) => sum + s.presentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
if (loading) {
  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="sticky top-0 z-20 bg-[#121212]/50 backdrop-blur-sm border-b border-[#242424] pb-2">
          <Skeleton className="h-8 w-1/3 bg-[#232323] mb-2" />
          <Skeleton className="h-4 w-1/6 bg-[#232323]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-lg bg-[#181818]" />
          <Skeleton className="h-24 w-full rounded-lg bg-[#181818]" />
          <Skeleton className="h-24 w-full rounded-lg bg-[#181818]" />
          <Skeleton className="h-24 w-full rounded-lg bg-[#181818]" />
        </div>

        <div className="space-y-4 mt-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border border-[#242424] bg-[#181818] rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-2 border-b border-[#222] bg-[#222] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32 bg-[#232323]" />
                  <Skeleton className="h-4 w-16 bg-blue-900" />
                </div>
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-20 bg-[#232323]" />
                  <Skeleton className="h-4 w-20 bg-[#232323]" />
                  <Skeleton className="h-4 w-12 bg-[#232323]" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  {[...Array(11)].map((_, idx) => (
                    <Skeleton key={idx} className="h-4 w-20 bg-[#232323] rounded" />
                  ))}
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      {[...Array(11)].map((_, colIdx) => (
                        <Skeleton key={colIdx} className="h-4 w-20 bg-[#181818] rounded" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 border border-rose-300 bg-rose-50">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4">
      <div className="px-40 mx-auto space-y-3">
        <div className="sticky top-0 z-20 bg-[#121212]/50 backdrop-blur-sm flex items-center justify-between border-b border-[#242424] pb-2">
          <div className="px-5 ">
            <h1 className="text-2xl font-semibold text-white">Portfolio Dashboard</h1>
            {lastUpdate && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Card className="px-4 py-3 border border-[#242424] bg-[#181818] shadow-lg">
            <p className="text-xs font-semibold text-gray-400">Total Investment</p>
            <p className="text-xl font-bold text-white mt-1">
              {formatCurrency(totalInvestment)}
            </p>
          </Card>
          <Card className="px-4 py-3 border border-[#242424] bg-[#181818] shadow-lg">
            <p className="text-xs font-semibold text-gray-400">Present Value</p>
            <p className="text-xl font-bold text-white mt-1">
              {formatCurrency(totalPresentValue)}
            </p>
          </Card>
          <Card className="px-4 py-3 border border-[#242424] bg-[#181818] shadow-lg">
            <p className="text-xs font-semibold text-gray-400">Total Gain/Loss</p>
            <p className={`text-xl font-bold mt-1 ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
          </Card>
          <Card className="px-4 py-3 border border-[#242424] bg-[#181818] shadow-lg">
            <p className="text-xs font-semibold text-gray-400">Return %</p>
            <p className={`text-xl font-bold mt-1 ${totalGainLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(totalGainLossPercent)}
            </p>
          </Card>
        </div>
        <PortfolioCharts
          sectors={sectors}
          totalInvestment={totalInvestment}
          totalPresentValue={totalPresentValue}
        />
        {sectors.map(sector => (
          <Card key={sector.sector} className="border border-[#242424] bg-[#181818] overflow-hidden shadow-lg">
            <div className="px-6 py-2 border-b border-[#222] bg-[#222]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide">{sector.sector}</h2>
                  <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs font-semibold rounded">
                    {sector.portfolioPercent.toFixed(2)}% of Portfolio
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs font-medium">
                  <span className="text-gray-300">
                    Investment: <span className="font-semibold text-white">{formatCurrency(sector.totalInvestment)}</span>
                  </span>
                  <span className="text-gray-300">
                    Value: <span className="font-semibold text-white">{formatCurrency(sector.totalPresentValue)}</span>
                  </span>
                  <span className={`font-bold ${sector.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercent(sector.gainLossPercent)}
                  </span>
                </div>
              </div>
            </div>
            <Table className="bg-[#181818] text-white">
              <TableHeader>
                <TableRow className="bg-[#222] border-b border-[#333]">

                  <TableHead className="text-xs font-semibold text-gray-400">Particulars</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Purchase Price</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Qty</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Investment</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Portfolio %</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400">Exchange</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">CMP</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Present Value</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Gain/Loss</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">P/E Ratio</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 text-right">Latest Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sector.stocks.map(stock => (
                  <TableRow key={`${stock.symbol}_${stock.exchange}`} className="hover:bg-[#232323] border-b border-[#222]">

                    <TableCell className="text-xs font-medium text-white">{stock.particulars}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">₹{stock.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">{stock.quantity}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">{formatCurrency(stock.investment)}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">{stock.portfolioPercent.toFixed(2)}%</TableCell>
                    <TableCell className="text-xs text-gray-400">{stock.exchange}</TableCell>
                    <TableCell className="text-xs font-bold text-white text-right">₹{stock.cmp.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">{formatCurrency(stock.presentValue)}</TableCell>
                    <TableCell className={`text-xs font-bold text-right ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(stock.gainLoss)} ({formatPercent(stock.gainLossPercent)})
                    </TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">{stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-xs text-gray-300 text-right">
                      {stock.yearlyEarnings ? formatCurrency(stock.yearlyEarnings) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
}
