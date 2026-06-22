-- Preserve today's counters: rename rather than drop/add.
ALTER TABLE "RateLimit" RENAME COLUMN "voiceCount" TO "voiceSeconds";
