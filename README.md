# GaadiBids 🇮🇳🔨

> Enthusiast car auction platform built for the Indian market, inspired by Cars & Bids.

GaadiBids brings transparent, week-long online auctions to India's growing modern classic and performance car community — with independent inspections, anti-sniping bid clocks, full RTO documentation & transfer workflows, and secure escrow settlement.

![GaadiBids Platform Preview](./public/cars/lancer_evo.jpg)

---

## ⚡ Features

- **Live Auction Engine**:
  - Live anti-sniping countdown timer (late bids within 2 minutes extend the clock).
  - Dynamic bid increments tuned for INR brackets (₹5K to ₹50K steps).
  - Simulated active bidding feed and instant high-bid notification alerts with Sonner.
- **Indian Market Localization**:
  - State and RTO registration tracking (e.g. `KA-03`, `MH-12`, `DL-8C`, `HP-01`).
  - Ownership counts, hypothecation status, PUC, road-tax & insurance breakdown.
  - Transparent 4.5% buyer's fee calculation (min ₹10K, capped at ₹1.5L + 18% GST).
  - RTO transfer, inter-state NOC, and Delhi-NCR age compliance guidelines.
- **Enthusiast Listing Experience**:
  - Curated car catalog (Mitsubishi Lancer Evo X, BMW E46 M3, Maruti Gypsy King, Octavia vRS, VW Polo GT TSI, Mahindra Thar, etc.).
  - Detailed specs: "Our Take" editorial review, highlights, equipment, modifications, known flaws, and service history.
  - High-resolution gallery with full-screen carousel lightbox.
  - Interactive community comments, seller Q&A, and chronological bid ladders.
- **Seller Flow & Past Results**:
  - 4-step interactive vehicle listing intake flow.
  - Public historical sales archive with sell-through rates and price records.
- **Design & UI**:
  - Modern aesthetic built with **shadcn/ui**, Tailwind CSS v4, Lucide icons, and light/dark theme support.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library / UI**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI Primitives, Lucide React
- **Design System**: shadcn/ui
- **State & Real-time**: `useSyncExternalStore` timer clock, custom live auction store, Embla Carousel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/R-Crypt/carsNbids.git
cd carsNbids
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev -- -p 3456
```

Open [http://localhost:3456](http://localhost:3456) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License

MIT License. Designed and crafted for Indian car enthusiasts.
