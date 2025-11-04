const express = require('express');
const { getAllPortfolio, getStockPrice } = require('../controllers/portfolio.controller');

const router = express.Router();

router.get('/', getAllPortfolio);
router.get('/stock/:symbol/:exchange', getStockPrice);

module.exports = router;
