require('dotenv').config();
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Dashboard API - 8byte Assignment',
    endpoints: {
      portfolio: '/api/portfolio',
      stockPrice: '/api/portfolio/stock/:symbol/:exchange'
    }
  });
});

app.use('/api/portfolio', portfolioRoutes);

app.listen(PORT, () => {
  console.log(`\nPortfolio Dashboard API`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  - GET /api/portfolio`);
  console.log(`  - GET /api/portfolio/stock/:symbol/:exchange\n`);
});
