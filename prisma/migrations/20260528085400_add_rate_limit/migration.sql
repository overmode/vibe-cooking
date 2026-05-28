-- CreateTable
CREATE TABLE "RateLimit" (
    "userId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("userId","day")
);
