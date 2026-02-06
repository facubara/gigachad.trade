-- CreateTable
CREATE TABLE "WalletStats" (
    "id" TEXT NOT NULL,
    "walletHash" TEXT NOT NULL,
    "totalBuyCount" INTEGER NOT NULL DEFAULT 0,
    "totalSellCount" INTEGER NOT NULL DEFAULT 0,
    "weightedAvgEntryPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uniqueBuyDays" INTEGER NOT NULL DEFAULT 0,
    "currentHoldings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalStats" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "totalWalletsAnalyzed" INTEGER NOT NULL DEFAULT 0,
    "entryPriceP25" DOUBLE PRECISION,
    "entryPriceP50" DOUBLE PRECISION,
    "entryPriceP75" DOUBLE PRECISION,
    "avgEntryPrice" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletStats_walletHash_key" ON "WalletStats"("walletHash");

-- CreateIndex
CREATE INDEX "WalletStats_weightedAvgEntryPrice_idx" ON "WalletStats"("weightedAvgEntryPrice");
