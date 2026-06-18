  <h1 align="center">SplitPay</h1>
  <p align="center">
    A premium split bill calculator and payment dashboard built on the Stellar Blockchain.
  </p>
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://stellar.org/"><img src="https://img.shields.io/badge/Stellar-Network-000000?logo=stellar" alt="Stellar" /></a>
  </p>
</div>

<br />

> **SplitPay** is a minimal, highly polished split pay platform that allows you to easily split bills with friends and instantly settle up using the Stellar Network. Built with Next.js, TailwindCSS, and the Stellar SDK, it features a clean and responsive interface with real-time blockchain sync.

<div align="center">
  <img src="./Demo.gif" alt="SplitPay Demo" width="100%" />
</div>

<br />

## ✦ Features

- **Freighter Wallet Integration:** Connect seamlessly to the Stellar ecosystem.
- **Atomic Bill Splitting:** Calculate exact splits (including tips) down to the stroop.
- **One-Click Settlement:** Send testnet XLM directly to your friends' wallets instantly.
- **Real-time Ledger:** View your live wallet balance and incoming/outgoing transaction history.
- **Minimal & Polished UI:** Built with modern web design principles—focusing on clarity, fast micro-interactions, and a perfectly responsive layout.

---

## ✦ Quick Start

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ✦ Stellar Testnet Guide

SplitPay operates entirely on the **Stellar Testnet**.

### 1. Setup Freighter Wallet
1. Download the [Freighter extension](https://www.freighter.app/).
2. Open **Settings > Preferences > Network**.
3. Switch from `Mainnet` to `Testnet`.

### 2. Get Test Funds
1. Copy your public key from Freighter.
2. Go to the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test).
3. Paste your public key and click **Get test network lumens**.

*(Tip: Create a second account in Freighter to act as your "friend" to test transactions!)*

### 3. Settle Up
1. Click **Connect Wallet** in SplitPay.
2. Enter your bill total and the recipient's public key.
3. Click **Send Payment**, approve it in Freighter, and watch it clear in ~3-5 seconds!

---

<p align="center">
  <small>© 2026 SplitPay. Licensed under the MIT License.</small>
</p>
