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
      <div className="rounded-lg bg-[#181818] border border-[#242424] p-3 text-xs shadow-lg min-w-[140px]">
        <p className="font-semibold text-white mb-1">{payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-300">
            {entry.name}: <span className="font-bold text-white">{typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}</span>
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
    const color = value >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <div className="rounded-lg bg-[#181818] border border-[#242424] p-3 text-xs shadow-lg min-w-[140px]">
        <p className="font-semibold text-white mb-1">{payload[0].payload.name}</p>
        <p className={`font-bold ${color}`}>
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
      <div className="rounded-lg bg-[#181818] border border-[#242424] p-3 text-xs shadow-lg min-w-[140px]">
        <p className="font-semibold text-white mb-1">{payload[0].name}</p>
        <p className="text-gray-300">
          Investment: <span className="font-bold text-white">{formatCurrency(payload[0].value)}</span>
        </p>
        <p className="text-gray-300">
          Portfolio %: <span className="font-bold text-white">{payload[0].payload.percent.toFixed(2)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

return (
  <div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <Card className="p-3 border border-[#242424] bg-[#181818] shadow-lg">
        <h3 className="text-sm font-bold text-white mb-2">
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

      <Card className="p-3 border border-[#242424] bg-[#181818] shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">
          Sector Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectorPerformanceData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#d1d5db" }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11, fill: "#d1d5db" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#d1d5db' }} />
            <Bar dataKey="investment" fill="#64748b" name="Investment" />
            <Bar dataKey="presentValue" fill="#3b82f6" name="Present Value" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-1 mt-2 gap-2">
      <Card className="p-3 border border-[#242424] bg-[#181818] shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">
          Gain/Loss by Sector
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectorPerformanceData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#d1d5db" }}
              angle={-45}
              textAnchor="end"
              height={30}
            />
            <YAxis tick={{ fontSize: 11, fill: "#d1d5db" }} />
            <Tooltip content={<CustomGainLossTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#d1d5db' }} />
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
