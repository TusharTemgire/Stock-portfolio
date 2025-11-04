import { Holding, StockPrice, PortfolioStock, SectorSummary } from './portfolio-types';

export function calculatePortfolio(
  holdings: Holding[],
  prices: Record<string, StockPrice>
): PortfolioStock[] {
  return holdings.map(holding => {
    const priceKey = `${holding.symbol}_${holding.exchange}`;
    const priceData = prices[priceKey];

    const investment = holding.purchasePrice * holding.quantity;
    const cmp = priceData?.cmp || 0;
    const presentValue = cmp * holding.quantity;
    const gainLoss = presentValue - investment;
    const gainLossPercent = investment > 0 ? (gainLoss / investment) * 100 : 0;

    return {
      ...holding,
      cmp,
      investment,
      presentValue,
      gainLoss,
      gainLossPercent,
      portfolioPercent: 0,
      peRatio: priceData?.peRatio || 0,
      yearlyEarnings: priceData?.yearlyEarnings || 0,
    };
  });
}

export function calculatePortfolioPercents(stocks: PortfolioStock[]): PortfolioStock[] {
  const totalInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);
  
  return stocks.map(stock => ({
    ...stock,
    portfolioPercent: totalInvestment > 0 ? (stock.investment / totalInvestment) * 100 : 0,
  }));
}

export function groupBySector(stocks: PortfolioStock[]): SectorSummary[] {
  const sectorMap = new Map<string, PortfolioStock[]>();

  stocks.forEach(stock => {
    const existing = sectorMap.get(stock.sector) || [];
    sectorMap.set(stock.sector, [...existing, stock]);
  });

  const totalPortfolioInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);

  return Array.from(sectorMap.entries()).map(([sector, sectorStocks]) => {
    const totalInvestment = sectorStocks.reduce((sum, s) => sum + s.investment, 0);
    const totalPresentValue = sectorStocks.reduce((sum, s) => sum + s.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
    const portfolioPercent = totalPortfolioInvestment > 0 ? (totalInvestment / totalPortfolioInvestment) * 100 : 0;

    return {
      sector,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercent,
      portfolioPercent,
      stocks: sectorStocks,
    };
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
