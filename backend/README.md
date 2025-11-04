# Portfolio Backend API

A Node.js + Express backend API for managing stock portfolio data with real-time prices from Yahoo Finance.

---

## Setup

```bash
npm install
npm run dev
```

Server runs on: `http://localhost:5000`

---

## Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
```

---

## API Endpoints

### Health Check
```
GET /health
```

Returns server status and version info.

**Response:**
```json
{
  "status": "OK",
  "message": "Portfolio API is running",
  "timestamp": "2025-11-04T16:49:58.000Z",
  "version": "1.0.0"
}
```

---

### Get Portfolio Holdings
```
GET /api/portfolio/holdings
```

Returns static portfolio configuration (26 stocks).

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 26
}
```

---

### Get Batch Stock Prices
```
POST /api/portfolio/prices
Content-Type: application/json

{
  "stocks": [
    {"symbol": "HDFCBANK", "exchange": "NSE"},
    {"symbol": "INFY", "exchange": "NSE"}
  ]
}
```

Returns current prices and details for multiple stocks.

**Response:**
```json
{
  "success": true,
  "data": {
    "HDFCBANK_NSE": {
      "symbol": "HDFCBANK.NS",
      "longName": "HDFC Bank Limited",
      "cmp": 985.25,
      "change": -7.40,
      "changePercent": -0.75,
      "previousClose": 992.65,
      "open": 987,
      "dayHigh": 997,
      "dayLow": 983.7,
      "peRatio": 20.96,
      "currentYear": 2025,
      "yearlyRevenue": 1683023700000,
      "yearlyEarnings": 707922500000,
      "timestamp": "2025-11-04T16:49:58.000Z"
    }
  },
  "total": 2,
  "successful": 2,
  "failed": 0
}
```

---

### Get Single Stock Price
```
GET /api/portfolio/price/:symbol/:exchange
```

Returns real-time data for a single stock.

**Example:** `/api/portfolio/price/HDFCBANK/NSE`

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "HDFCBANK.NS",
    "longName": "HDFC Bank Limited",
    "cmp": 985.25,
    "change": -7.40,
    "changePercent": -0.75,
    "previousClose": 992.65,
    "open": 987,
    "dayHigh": 997,
    "dayLow": 983.7,
    "peRatio": 20.96,
    "currentYear": 2025,
    "yearlyRevenue": 1683023700000,
    "yearlyEarnings": 707922500000,
    "timestamp": "2025-11-04T16:49:58.000Z"
  }
}
```

---

## Tech Stack

- Node.js + Express
- yahoo-finance2 (Real-time stock data)
- CORS enabled for cross-origin requests

---

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Get all holdings
curl http://localhost:5000/api/portfolio/holdings

# Get single stock price
curl http://localhost:5000/api/portfolio/price/HDFCBANK/NSE

# Batch request
curl -X POST http://localhost:5000/api/portfolio/prices \
  -H "Content-Type: application/json" \
  -d '{"stocks":[{"symbol":"HDFCBANK","exchange":"NSE"}]}'
```

---

## Notes

- Use NSE symbols for best results
- All timestamps are in ISO 8601 format (UTC)
- Error responses include `success: false` with error details