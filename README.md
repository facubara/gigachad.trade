# gigachad.trade

Community platform for the GIGACHAD token on Solana. Track the token's journey to a $1B market cap, analyze your portfolio, compete on the leaderboard, and have fun with the clicker game.

**Live:** [gigachad.trade](https://gigachad.trade)

## Features

### Token Dashboard
Real-time GIGACHAD price, market cap, 24h volume, and a progress bar tracking the road to $1B — powered by DexScreener.

### Portfolio Calculator
Enter your Solana wallet address to see your GIGACHAD holdings, weighted average entry price, profit/loss, and full transaction history parsed via Helius.

### Clicker Game
Push-up clicker game with a perk system (multipliers and auto-clickers), persistent scores, and a community leaderboard.

### Tipping
Send SOL tips directly through Phantom wallet with preset or custom amounts.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **Database:** PostgreSQL (Supabase) via Prisma
- **Blockchain:** Solana (web3.js, Phantom wallet)
- **APIs:** DexScreener, Helius, CoinGecko
- **Video:** Remotion (for shareable video generation)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- [Helius API key](https://helius.dev)

### Installation

```bash
npm install
npx prisma generate
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
HELIUS_API_KEY="your-helius-api-key"
NEXT_PUBLIC_SOLANA_RPC_URL="your-solana-rpc-url"
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Other Scripts

| Command | Description |
|---|---|
| `npm run lint` | Lint and autofix |
| `npm run typecheck` | Type check without emitting |
| `npm run remotion:studio` | Open Remotion video editor |
| `npm run remotion:render` | Render shareable videos |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (player, token, wallet, leaderboard)
│   ├── calculator/    # Portfolio calculator page
│   ├── clicker/       # Clicker game page
│   ├── leaderboard/   # Leaderboard page
│   └── share/         # Share functionality
├── components/        # React components
├── hooks/             # Custom hooks (usePlayer, useTokenPrice, usePhantom, etc.)
└── lib/               # Utilities, API clients, constants
prisma/                # Database schema & migrations
remotion/              # Video generation compositions
```

## License

All rights reserved.
