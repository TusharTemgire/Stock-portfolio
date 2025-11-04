const portfolioData = require('../config/portfolioData');
const { getCMP } = require('./yahooFinance');
const { getPERatioAndEarnings } = require('./googleFinance');

async function getCompletePortfolio() {
  const enrichedStocks = [];

  for (const stock of portfolioData) {
    const cmp = await getCMP(stock.symbol, stock.exchange);
    const { peRatio, latestEarnings } = await getPERatioAndEarnings(stock.symbol, stock.exchange);

    const investment = stock.purchasePrice * stock.quantity;
    const presentValue = cmp ? cmp * stock.quantity : 0;
    const gainLoss = presentValue - investment;
    const gainLossPercent = investment > 0 ? (gainLoss / investment) * 100 : 0;

    enrichedStocks.push({
      particulars: stock.particulars,
      purchasePrice: stock.purchasePrice,
      quantity: stock.quantity,
      investment: investment,
      portfolioPercent: 0,
      exchange: stock.exchange,
      cmp: cmp,
      presentValue: presentValue,
      gainLoss: gainLoss,
      gainLossPercent: gainLossPercent,
      peRatio: peRatio,
      latestEarnings: latestEarnings,
      sector: stock.sector
    });
  }

  const totalInvestment = enrichedStocks.reduce((sum, s) => sum + s.investment, 0);

  enrichedStocks.forEach(stock => {
    stock.portfolioPercent = totalInvestment > 0 ? (stock.investment / totalInvestment) * 100 : 0;
  });

  const sectors = groupBySector(enrichedStocks);

  return {
    stocks: enrichedStocks,
    sectors: sectors,
    totalInvestment: totalInvestment,
    totalPresentValue: enrichedStocks.reduce((sum, s) => sum + s.presentValue, 0),
    totalGainLoss: enrichedStocks.reduce((sum, s) => sum + s.gainLoss, 0)
  };
}

function groupBySector(stocks) {
  const sectorMap = {};

  stocks.forEach(stock => {
    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = [];
    }
    sectorMap[stock.sector].push(stock);
  });

  const sectors = [];
  for (const sector in sectorMap) {
    const sectorStocks = sectorMap[sector];
    const totalInvestment = sectorStocks.reduce((sum, s) => sum + s.investment, 0);
    const totalPresentValue = sectorStocks.reduce((sum, s) => sum + s.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;

    sectors.push({
      sector: sector,
      totalInvestment: totalInvestment,
      totalPresentValue: totalPresentValue,
      totalGainLoss: totalGainLoss,
      stocks: sectorStocks
    });
  }

  return sectors;
}

module.exports = { getCompletePortfolio };
