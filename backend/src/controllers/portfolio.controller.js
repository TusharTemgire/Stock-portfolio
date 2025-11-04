const { getCompletePortfolio } = require('../services/portfolio');
const { getCMP } = require('../services/yahooFinance');
const { getPERatioAndEarnings } = require('../services/googleFinance');

async function getAllPortfolio(req, res) {
  try {
    const portfolio = await getCompletePortfolio();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}

async function getStockPrice(req, res) {
  try {
    const { symbol, exchange } = req.params;
    const cmp = await getCMP(symbol, exchange);
    const { peRatio, latestEarnings } = await getPERatioAndEarnings(symbol, exchange);

    if (cmp === null) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({
      symbol,
      exchange,
      cmp,
      peRatio,
      latestEarnings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
}

module.exports = { getAllPortfolio, getStockPrice };
