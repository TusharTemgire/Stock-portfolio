import { Holding, StockPrice } from './portfolio-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchHoldings(): Promise<Holding[]> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio/holdings`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch holdings');
  }
  
  const data = await response.json();
  return data.data;
}

export async function fetchBatchPrices(holdings: Holding[]): Promise<Record<string, StockPrice>> {
  const stocks = holdings.map(h => ({
    symbol: h.symbol,
    exchange: h.exchange
  }));

  const response = await fetch(`${API_BASE_URL}/api/portfolio/prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stocks }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }

  const data = await response.json();
  return data.data;
}
