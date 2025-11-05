'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Rectangle } from 'recharts';
import { SectorSummary } from '@/lib/portfolio-types';
import { formatCurrency } from '@/lib/portfolio-utils';
import { Card } from '@/components/ui/card';

interface PortfolioChartsProps {
  sectors: SectorSummary[];
  totalInvestment: number;
  totalPresentValue: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function PortfolioCharts({ sectors, totalInvestment, totalPresentValue }: PortfolioChartsProps) {
  const sectorAllocationData = sectors.map(sector => ({
    name: sector.sector,
    value: sector.totalInvestment,
    percent: sector.portfolioPercent,
  }));

  const sectorPerformanceData = sectors.map(sector => ({
    name: sector.sector,
    investment: sector.totalInvestment,
    presentValue: sector.totalPresentValue,
    gainLoss: sector.totalGainLoss,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 text-xs">
          <p className="font-semibold text-slate-900">{payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomGainLossTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const color = value >= 0 ? '#10b981' : '#ef4444';
      return (
        <div className="bg-white border border-slate-200 p-3 text-xs">
          <p className="font-semibold text-slate-900">{payload[0].payload.name}</p>
          <p style={{ color: color, fontWeight: 600 }}>
            Gain/Loss: {formatCurrency(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 text-xs">
          <p className="font-semibold text-slate-900">{payload[0].name}</p>
          <p className="text-slate-700">
            Investment: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-slate-700">
            Portfolio %: {payload[0].payload.percent.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="p-3 border border-slate-200 bg-white">
          <h3 className="text-sm font-bold text-slate-900  ">
            Sector Allocation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} (${entry.percent.toFixed(1)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-3 border border-slate-200 bg-white">
          <h3 className="text-sm font-bold text-slate-900 mb-4 ">
            Sector Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorPerformanceData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="investment" fill="#64748b" name="Investment" />
              <Bar dataKey="presentValue" fill="#3b82f6" name="Present Value" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 mt-2 gap-2">
        <Card className="p-3 border border-slate-200 bg-white">
          <h3 className="text-sm font-bold text-slate-900 mb-4 ">
            Gain/Loss by Sector
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorPerformanceData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={30}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomGainLossTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="gainLoss" name="Gain/Loss">
                {sectorPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.gainLoss >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
