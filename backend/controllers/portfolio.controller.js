const portfolioData = require('../config/portfolioData');
const { getYahooStockData, getBatchYahooStockData } = require('../services/yahooFinance');

async function getPortfolioHoldings(req, res) {
  try {
    res.json({
      success: true,
      data: portfolioData,
      total: portfolioData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio holdings',
      details: error.message
    });
  }
}

async function getBatchStockPrices(req, res) {
  try {
    const { stocks } = req.body;

    if (!Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: stocks array is required',
       
      });
    }

    const results = await getBatchYahooStockData(stocks);

    const prices = {};
    results.forEach(result => {
      const key = `${result.stock.symbol}_${result.stock.exchange}`;
      if (result.success) {
        prices[key] = {
          symbol: result.data.symbol,
          longName: result.data.longName,
          cmp: result.data.cmp,
          change: result.data.change,
          changePercent: result.data.changePercent,
          previousClose: result.data.previousClose,
          open: result.data.open,
          dayHigh: result.data.dayHigh,
          dayLow: result.data.dayLow,
          peRatio: result.data.peRatio,
          currentYear: result.data.currentYear,
          yearlyRevenue: result.data.yearlyRevenue,
          yearlyEarnings: result.data.yearlyEarnings,
          timestamp: result.data.timestamp
        };
      } else {
        prices[key] = {
          error: result.error,
          symbol: result.stock.symbol,
          exchange: result.stock.exchange
        };
      }
    });

    res.json({
      success: true,
      data: prices,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock prices',
      details: error.message
    });
  }
}

async function getSingleStockPrice(req, res) {
  try {
    const { symbol, exchange } = req.params;
    const data = await getYahooStockData(symbol, exchange);

    res.json({
      success: true,
      data: {
        symbol: data.symbol,
        longName: data.longName,
        cmp: data.cmp,
        change: data.change,
        changePercent: data.changePercent,
        previousClose: data.previousClose,
        open: data.open,
        dayHigh: data.dayHigh,
        dayLow: data.dayLow,
        peRatio: data.peRatio,
        currentYear: data.currentYear,
        yearlyRevenue: data.yearlyRevenue,
        yearlyEarnings: data.yearlyEarnings,
        timestamp: data.timestamp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock price',
      details: error.message
    });
  }
}

module.exports = {
  getPortfolioHoldings,
  getBatchStockPrices,
  getSingleStockPrice
};
