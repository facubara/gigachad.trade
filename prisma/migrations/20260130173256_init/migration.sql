-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "totalPushups" INTEGER NOT NULL DEFAULT 0,
    "pushupsPerSecond" INTEGER NOT NULL DEFAULT 0,
    "perks" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" SERIAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "totalPushups" INTEGER NOT NULL,
    "pushupsPerSecond" INTEGER NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardMeta" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "snapshotId" TEXT NOT NULL,
    "lastRefreshed" TIMESTAMP(3) NOT NULL,
    "totalPlayers" INTEGER NOT NULL,

    CONSTRAINT "LeaderboardMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Player_totalPushups_idx" ON "Player"("totalPushups" DESC);

-- CreateIndex
CREATE INDEX "LeaderboardEntry_snapshotId_rank_idx" ON "LeaderboardEntry"("snapshotId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardMeta_snapshotId_key" ON "LeaderboardMeta"("snapshotId");
