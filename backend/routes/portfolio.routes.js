const express = require("express");
const {
  getPortfolioHoldings,
  getBatchStockPrices,
  getSingleStockPrice
} = require("../controllers/portfolio.controller");

const router = express.Router();

router.get("/holdings", getPortfolioHoldings);
router.post("/prices", getBatchStockPrices);
router.get("/price/:symbol/:exchange", getSingleStockPrice);

module.exports = router;
