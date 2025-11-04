const axios = require('axios');

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'M9H9V78YB4UIGYT3';

async function getStockQuote(symbol, exchange) {
  try {
    const alphaSymbol = `${symbol}.BSE`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaSymbol}&apikey=${API_KEY}`;

    const response = await axios.get(url);
    const data = response.data['Global Quote'];

    if (!data || !data['05. price']) {
      return null;
    }

    return parseFloat(data['05. price']);
  } catch (error) {
    return null;
  }
}

async function getBulkQuotes(symbols) {
  try {
    const symbolString = symbols.join(',');
    const url = `https://www.alphavantage.co/query?function=REALTIME_BULK_QUOTES&symbol=${symbolString}&apikey=${API_KEY}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Alpha Vantage bulk quotes error:', error.message);
    return null;
  }
}

module.exports = { getStockQuote, getBulkQuotes };
