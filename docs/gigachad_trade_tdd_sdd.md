# Technical Design Document (TDD / SDD)

**Project:** Gigachad Token Website  
**Domain:** gigachad.trade  
**Environment:** Production (Vercel)  
**Related PRD:** Gigachad.trade PRD

---

## 1. Overview

This document translates the Product Requirements Document (PRD) into a concrete, buildable engineering plan. It defines the system architecture, data models, APIs, and technical decisions required to implement **gigachad.trade** efficiently while keeping scope intentionally limited.

The system prioritizes:
- Low operational complexity
- Fast iteration
- Acceptable trade-offs around data integrity and abuse

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────┐
│   Client (Web)   │
│ Next.js / React  │
└────────┬─────────┘
         │ HTTPS
         ▼
┌─────────────────────────┐
│ Next.js API Routes      │
│ (Backend-for-Frontend) │
└────────┬────────────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│   Database       │      │ External APIs    │
│ (Postgres / KV) │      │ DexScreener      │
└──────────────────┘      └──────────────────┘
```

### 2.2 Component Responsibilities

#### Frontend
- UI rendering and animations
- Market cap visualization
- Multiplier animation logic
- Clicker game client logic
- Phantom wallet integration for tipping

#### Backend (Next.js API Routes)
- Fetch and normalize token price data
- Persist clicker progress
- Aggregate leaderboard data
- Expose internal APIs to frontend

#### Database
- Store player progress
- Store leaderboard snapshots
- Minimal schema, no relational complexity

#### External Services
- **DexScreener API**: Token price source
- **Solana RPC / Phantom**: Transaction signing (client-side)

---

## 3. Data Design

### 3.1 Core Entities

#### 3.1.1 Player

Represents a unique clicker participant.

```
Player
------
id (uuid, pk)
display_name (string)
total_pushups (bigint)
pushups_per_second (float)
created_at (timestamp)
updated_at (timestamp)
```

Notes:
- `display_name` is auto-generated (e.g. `GIGA#1042`)
- No wallet address stored
- Identity is session- or cookie-based

---

#### 3.1.2 Perk (Static Definition)

```
Perk
----
id (string)
name (string)
description (string)
cost (bigint)
pps_bonus (float)
```

Notes:
- Perks are defined statically in code
- No DB persistence required

---

#### 3.1.3 Leaderboard Snapshot

```
LeaderboardSnapshot
-------------------
id (uuid, pk)
date (date)
entries (jsonb)
created_at (timestamp)
```

Where `entries` contains:
```
[
  {
    "display_name": "GIGA#1042",
    "total_pushups": 123456
  }
]
```

Snapshots are regenerated daily.

---

### 3.2 Data Flow

1. User opens site
2. Frontend requests token price from backend
3. Backend fetches price from DexScreener
4. Frontend computes market cap and multiplier
5. User interacts with clicker
6. Backend updates player totals
7. Daily job aggregates leaderboard snapshot

---

### 3.3 Validation Rules

- Push-up increments must be non-negative
- PPS values capped server-side
- Leaderboard aggregation is idempotent per day

No anti-cheat beyond basic sanity checks.

---

## 4. Interface Specifications (APIs)

All APIs are internal and exposed via Next.js API routes.

---

### 4.1 Token Price

**GET** `/api/token/price`

**Response**
```json
{
  "priceUsd": 0.00001234,
  "timestamp": 1730000000
}
```

**Errors**
- `502`: DexScreener unavailable

---

### 4.2 Player Initialization

**POST** `/api/player/init`

**Response**
```json
{
  "playerId": "uuid",
  "displayName": "GIGA#1042",
  "totalPushups": 0,
  "pushupsPerSecond": 0
}
```

---

### 4.3 Update Pushups

**POST** `/api/player/pushups`

**Request**
```json
{
  "playerId": "uuid",
  "delta": 10
}
```

**Response**
```json
{
  "totalPushups": 1234,
  "pushupsPerSecond": 1.5
}
```

**Errors**
- `400`: Invalid delta
- `404`: Player not found

---

### 4.4 Leaderboard

**GET** `/api/leaderboard`

**Response**
```json
{
  "date": "2026-01-20",
  "entries": [
    { "displayName": "GIGA#1001", "totalPushups": 999999 }
  ]
}
```

---

## 5. Wallet & Tipping Integration

- Phantom wallet integration is client-side only
- Preset SOL amounts (0.1, 0.25)
- Uses `window.solana` provider
- No backend transaction verification

Backend does not track donations.

---

## 6. Technology Choices & Rationale

### 6.1 Frontend

**Chosen:** Next.js + React + Tailwind + Framer Motion

**Alternatives Considered:**
- Plain static HTML + JS → rejected due to animation complexity
- Astro → rejected due to interactive game state needs

---

### 6.2 Backend

**Chosen:** Next.js API Routes (BFF pattern)

**Alternatives Considered:**
- Separate Node/Express service → unnecessary overhead
- Serverless edge-only logic → insufficient for persistence

---

### 6.3 Database

**Chosen:** Managed Postgres or KV (Vercel / Supabase)

**Alternatives Considered:**
- MongoDB → unnecessary schema flexibility
- Pure localStorage → incompatible with global leaderboard

---

## 7. Non-Functional Requirements

- P95 API latency < 300ms
- Graceful degradation when DexScreener is down
- Mobile-friendly layout
- No authentication flows

---

## 8. Out of Scope

- Anti-cheat systems
- Wallet-based identity
- Real-time multiplayer sync
- Financial accounting or reporting

---

## 9. Open Decisions (Deferred)

- Exact database provider
- Cron mechanism for daily leaderboard snapshots
- Rate limiting thresholds

---

## 10. Summary

This design intentionally favors **speed, clarity, and psychological impact** over robustness or decentralization. All technical decisions align with the project’s short lifespan and meme-driven objectives.
