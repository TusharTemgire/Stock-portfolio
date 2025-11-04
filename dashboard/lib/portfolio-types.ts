export interface Holding {
  particulars: string;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  exchange: string;
  sector: string;
}

export interface StockPrice {
  symbol: string;
  longName: string;
  cmp: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  peRatio: number;
  currentYear: number;
  yearlyRevenue: number;
  yearlyEarnings: number;
  timestamp: string;
}

export interface PortfolioStock extends Holding {
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
  peRatio: number;
  yearlyEarnings: number;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
  stocks: PortfolioStock[];
}
