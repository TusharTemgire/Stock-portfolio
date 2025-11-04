const axios = require('axios');
const cheerio = require('cheerio');

async function getPERatioAndEarnings(symbol, exchange) {
  try {
    const searchSymbol = exchange === 'NSE' ? `NSE:${symbol}` : `BOM:${symbol}`;
    const url = `https://www.google.com/finance/quote/${searchSymbol}`;

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);

    let peRatio = null;
    let latestEarnings = null;

    $('div[class*="gyFHrc"]').each((i, elem) => {
      const label = $(elem).find('div[class*="mfs7Fc"]').text();
      const value = $(elem).find('div[class*="P6K39c"]').text();

      if (label.includes('PE ratio')) {
        peRatio = parseFloat(value) || null;
      }
      if (label.includes('Earnings per share')) {
        latestEarnings = value || null;
      }
    });

    return { peRatio, latestEarnings };
  } catch (error) {
    console.error(`Google Finance error for ${symbol}:`, error.message);
    return { peRatio: null, latestEarnings: null };
  }
}

module.exports = { getPERatioAndEarnings };
