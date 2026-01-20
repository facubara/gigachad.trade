# PRD — Gigachad Token Website

**Domain:** gigachad.trade  
**Chain:** Solana  
**Token Mint:** `63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9`

---

## 1. Product Overview

**Gigachad.trade** is a short-scope marketing and engagement website for the Gigachad Solana token. The product intentionally blends **fake-serious corporate aesthetics** with **meme culture**, focusing on market cap obsession, progression psychology, and playful interaction.

The site is explicitly designed as a hype and engagement surface — not a utility platform.

---

## 2. Goals & Success Criteria

### Primary Goals
- Reinforce the narrative of reaching **$1B market cap**
- Maximize time-on-site and repeat visits
- Encourage frictionless SOL tipping

### Success Metrics
- Average session duration
- Giga Clicker interaction depth
- Phantom tip conversion rate

---

## 3. Target Audience

- Solana-native traders and degens
- Crypto Twitter / X meme audience
- Desktop-first users, mobile-friendly
- Assumes Phantom wallet familiarity

No onboarding, education, or normie UX.

---

## 4. Brand & Visual Direction

### Aesthetic
- Predominantly black background
- High-contrast, premium typography
- Mock institutional / fitness-finance vibe
- Visual reference: **gigafitness.com**

### Tone
- Serious language applied to unserious goals
- Meme-forward, confidence-heavy
- No disclaimers, no apologies

---

## 5. Information Architecture

### Pages / Sections

#### Home (Primary)
- Hero section
- Market cap progress bar
- Multiplier to $1B
- Current token price
- Donation / tipping module
- Market cap milestones

#### Giga Clicker (Secondary)
- Clicker game
- Fake perks system
- Global leaderboard

Single-page flow with a distinct clicker section or route.

---

## 6. Functional Requirements

### 6.1 Token Data

- **Total Supply:** Fixed, hardcoded value
- **Price Source:** DexScreener API (single source of truth)

**Market Cap Formula:**
```
marketCap = price * totalSupply
```

If DexScreener is unavailable, values freeze.

---

### 6.2 Market Cap Progress Bar

- Target: **$1,000,000,000 USD**
- Static fill (no animation)
- Displays:
  - Percentage to $1B
  - Meme milestone labels below the bar

**Milestones (visual only):**
- 10M — Warming Up
- 50M — Alpha Phase
- 100M — Sigma Territory
- 500M — Final Form
- 1B — Ascended

---

### 6.3 Multiplier Module

Displays:
```
x{multiplier} to 1B
```

Where:
```
multiplier = 1_000_000_000 / currentMarketCap
```

**Behavior:**
- Animated count-up from x1.0 to current value
- Smooth easing via Framer Motion
- Rounded to readable precision (e.g. x2.3)

---

### 6.4 Price Display

- Shows current token price in USD
- Pulled from DexScreener
- Subtle animation on update (fade or tick)

---

## 7. Giga Clicker Game

### Core Mechanic
- 1 click = 1 push-up
- Push-ups generate additional push-ups over time

### Perks
- 100% fake
- Examples:
  - Protein Powder
  - Creatine
  - Gym Membership
- Some perks generate push-ups per second

No real rewards. No fulfillment.

---

### Progress Persistence

- Progress does **not reset per session**
- Stored server-side
- Designed to support a global leaderboard
- Wallet connection **not required** to play

---

### Leaderboard

- Global leaderboard
- Updated **daily**
- Ranking metric: **total lifetime push-ups**
- Users displayed as anonymized IDs (e.g. `GIGA#1042`)
- No wallet addresses shown

---

## 8. Tipping / Donations

### Wallet
- Single static Solana address (hardcoded)

### Wallet Support
- Phantom only

### UX
- One-click preset buttons:
  - 0.1 SOL
  - 0.25 SOL
- Phantom popup → confirm → done

No donation totals or transparency UI.

---

## 9. Technical Stack

### Frontend
- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- next-intl (RTL support, future-proofing)

### Hosting
- Vercel
- Domain: gigachad.trade

Stack is intentionally modern but not over-engineered.

---

## 10. Non-Goals / Out of Scope

Explicitly excluded:
- Whitepaper
- Roadmap
- Team section
- Token utility claims
- Governance / DAO features
- Legal disclaimers
- Multi-wallet support
- Social sharing features

---

## 11. Accepted Risks

- Dependency on DexScreener price data
- Fake rewards without disclaimers
- Easy leaderboard manipulation
- Phantom-only tipping UX

All risks are intentional and accepted.

---

## 12. Next Steps

Possible follow-ups:
- Component-level React breakdown
- API schema for clicker + leaderboard
- Copywriting for perks and milestones
- Cursor / Claude Code implementation plan

