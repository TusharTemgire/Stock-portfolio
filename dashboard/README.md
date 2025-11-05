# 8byte Portfolio Dashboard

A modern portfolio dashboard built with [Next.js](https://nextjs.org), featuring interactive charts, reusable UI components, and responsive design.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Learn More](#learn-more)
- [Deployment](#deployment)
- [License](#license)

## Features

- 📊 Portfolio charts and analytics
- 🧩 Modular, reusable UI components
- ⚡ Fast, optimized with Next.js
- 🎨 Custom fonts and styling
- 📱 Responsive design
- 🪝 Custom hooks for mobile and toast notifications

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
dashboard/
├── app/                # Main app entry, global styles, layout, pages
├── components/         # Portfolio dashboard, charts, and UI components
├── hooks/              # Custom React hooks
├── lib/                # API utilities, types, helpers
├── public/             # Static assets (fonts, images)
├── .env                # Environment variables
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
└── ...                 # Next.js build and config files
```

### Key Files

- `app/page.tsx` — Main dashboard page
- `components/portfolio-dashboard.tsx` — Dashboard UI
- `components/portfolio-charts.tsx` — Chart components
- `components/ui/` — Reusable UI elements (buttons, cards, tables, etc.)
- `hooks/use-mobile.ts` — Mobile device detection
- `hooks/use-toast.ts` — Toast notification logic
- `lib/api.ts` — API calls
- `lib/portfolio-types.ts` — Type definitions
- `lib/portfolio-utils.ts` — Portfolio helper functions

## Scripts

- `dev` — Start development server
- `build` — Build for production
- `start` — Start production server
- `lint` — Run ESLint

## Environment Variables

Create a `.env` file in the root directory for sensitive configuration (API keys, etc.).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Deployment](https://vercel.com/new)

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

## License

This project is licensed under the MIT License.