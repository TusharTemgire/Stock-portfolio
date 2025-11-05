# 8byte Portfolio Assignment

A full-stack stocks portfolio dashboard featuring a modern Next.js frontend and a Node.js backend API. Visualize your investments, analyze performance, and manage your portfolio with interactive charts and real-time data.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- 📊 Interactive portfolio charts and analytics
- 🧩 Modular, reusable UI components
- ⚡ Fast, optimized with Next.js
- 🎨 Custom fonts and styling
- 📱 Responsive design
- 🪝 Custom hooks for mobile and toast notifications
- 🔗 RESTful backend API with Yahoo Finance integration

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, CSS Modules
- **Backend:** Node.js, Express, Yahoo Finance API

---

## Project Structure

```
8byte-portofolio-aasingment/
├── dashboard/          # Frontend (Next.js)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── .env
│   └── ...
├── backend/            # Backend (Node.js/Express)
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── ...
└── README.md           # Project documentation
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
# Configure .env as needed
npm start
```
Backend runs at [http://localhost:3001](http://localhost:3001) by default.

### 2. Frontend Setup

```bash
cd dashboard
npm install
npm run dev
```
Frontend runs at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints (Backend)

- `GET /api/portfolio` — Get portfolio data
- `POST /api/portfolio` — Add/update portfolio data
- `GET /api/portfolio/:id` — Get specific portfolio item

See `backend/routes/portfolio.routes.js` for details.

---

## Environment Variables

Both frontend and backend use `.env` files for sensitive configuration (API keys, etc.).  
Create `.env` files in each folder and set your variables as needed.

---

## Deployment

- **Frontend:** Deploy on [Vercel](https://vercel.com/) or any Next.js-compatible platform.
- **Backend:** Deploy on [Render](https://render.com/), [Heroku](https://heroku.com/), or any Node.js hosting.

---

## License

This project is licensed under the MIT License.