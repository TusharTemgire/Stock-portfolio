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
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full bg-slate-200" />
            <Skeleton className="h-24 w-full bg-slate-200" />
            <Skeleton className="h-24 w-full bg-slate-200" />
            <Skeleton className="h-24 w-full bg-slate-200" />
          </div>
          <Skeleton className="h-96 w-full bg-slate-200" />
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
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Portfolio Dashboard</h1>
            {lastUpdate && (
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Card className="px-4 py-1 pt-2 border border-slate-200 bg-white">
            <p className="text-xs font-medium text-slate-600 ">Total Investment</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(totalInvestment)}
            </p>
          </Card>
          <Card className="px-4 py-1 pt-2 border border-slate-200 bg-white">
            <p className="text-xs font-medium text-slate-600 ">Present Value</p>
            <p className="text-xl font-bold text-slate-900">
              {formatCurrency(totalPresentValue)}
            </p>
          </Card>
          <Card className="px-4 py-1 pt-2 border border-slate-200 bg-white">
            <p className="text-xs font-medium text-slate-600 ">Total Gain/Loss</p>
            <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(totalGainLoss)}
            </p>
          </Card>
          <Card className="px-4 py-1 pt-2 border border-slate-200 bg-white">
            <p className="text-xs font-medium text-slate-600 ">Return %</p>
            <p className={`text-xl font-bold ${totalGainLossPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
          <Card key={sector.sector} className="border border-slate-200 bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{sector.sector}</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    {sector.portfolioPercent.toFixed(2)}% of Portfolio
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs font-medium">
                  <span className="text-slate-700">
                    Investment: <span className="font-semibold">{formatCurrency(sector.totalInvestment)}</span>
                  </span>
                  <span className="text-slate-700">
                    Value: <span className="font-semibold">{formatCurrency(sector.totalPresentValue)}</span>
                  </span>
                  <span className={`font-bold ${sector.totalGainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatPercent(sector.gainLossPercent)}
                  </span>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50 border-b border-slate-200">
                  <TableHead className="text-xs font-semibold text-slate-700">Particulars</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Purchase Price</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Qty</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Investment</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Portfolio %</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700">Exchange</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">CMP</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Present Value</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Gain/Loss</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">P/E Ratio</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right">Latest Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sector.stocks.map(stock => (
                  <TableRow key={`${stock.symbol}_${stock.exchange}`} className="hover:bg-slate-50 border-b border-slate-100">
                    <TableCell className="text-xs font-medium text-slate-900">{stock.particulars}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">₹{stock.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">{stock.quantity}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">{formatCurrency(stock.investment)}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">{stock.portfolioPercent.toFixed(2)}%</TableCell>
                    <TableCell className="text-xs text-slate-600">{stock.exchange}</TableCell>
                    <TableCell className="text-xs font-semibold text-slate-900 text-right">₹{stock.cmp.toFixed(2)}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">{formatCurrency(stock.presentValue)}</TableCell>
                    <TableCell className={`text-xs font-semibold text-right ${stock.gainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(stock.gainLoss)} ({formatPercent(stock.gainLossPercent)})
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">{stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-xs text-slate-700 text-right">
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
