const { getStockQuote } = require('./alphaVantage.service');

async function getCMP(symbol, exchange) {
  try {
    const price = await getStockQuote(symbol, exchange);
    return price;
  } catch (error) {
    return null;
  }
}

module.exports = { getCMP };
