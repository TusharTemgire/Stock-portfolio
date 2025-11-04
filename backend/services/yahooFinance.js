const yahooFinance = require('yahoo-finance2').default;

async function getYahooStockData(symbol, exchange = 'NSE') {
  try {
    const suffix = exchange === 'NSE' ? '.NS' : '.BO';
    const yahooSymbol = `${symbol}${suffix}`;

    const quote = await yahooFinance.quote(yahooSymbol);
    const summary = await yahooFinance.quoteSummary(yahooSymbol, {
      modules: ['earnings']
    });

    const currentYear = new Date().getFullYear();
    let yearlyRevenue = null;
    let yearlyEarnings = null;

    if (summary.earnings?.financialsChart?.yearly) {
      const yearData = summary.earnings.financialsChart.yearly.find(y => y.date === currentYear);
      if (yearData) {
        yearlyRevenue = yearData.revenue;
        yearlyEarnings = yearData.earnings;
      }
    }

    return {
      symbol: quote.symbol,
      longName: quote.longName,
      cmp: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      previousClose: quote.regularMarketPreviousClose,
      open: quote.regularMarketOpen,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      peRatio: quote.trailingPE,
      currentYear,
      yearlyRevenue,
      yearlyEarnings,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to fetch Yahoo data for ${symbol}: ${error.message}`);
  }
}

async function getBatchYahooStockData(stocks) {
  const results = await Promise.allSettled(
    stocks.map(stock => getYahooStockData(stock.symbol, stock.exchange))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        success: true,
        data: result.value,
        stock: stocks[index]
      };
    } else {
      return {
        success: false,
        error: result.reason.message,
        stock: stocks[index]
      };
    }
  });
}

module.exports = { getYahooStockData, getBatchYahooStockData };
