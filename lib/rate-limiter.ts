import prisma from "@/prisma/client";
import {
  MAX_MESSAGES_PER_DAY,
  MAX_SEARCHES_PER_DAY,
  MAX_VOICE_SECONDS_PER_DAY,
} from "@/lib/constants/app_validation";
import { type Limits } from "@/lib/types";

// Read today's usage and derive every verdict in one place. Callers gate on the
// flags, then record consumption via the increment helpers.
//
// ponytail: read-then-increment is not atomic, so concurrent requests can each
// see "under limit" and overshoot a per-day cap by a few. Acceptable for soft
// cost caps; the upgrade path is an atomic upsert that increments and checks the
// returned count in a single query.
export async function getLimits(userId: string): Promise<Limits> {
  const day = startOfUtcDay();
  const row = await prisma.rateLimit.findUnique({
    where: { userId_day: { userId, day } },
  });

  const messageCount = row?.messageCount ?? 0;
  const voiceSeconds = row?.voiceSeconds ?? 0;
  const searchCount = row?.searchCount ?? 0;

  return {
    messageCount,
    voiceSeconds,
    searchCount,
    messageLimitReached: messageCount >= MAX_MESSAGES_PER_DAY,
    voiceLimitReached: voiceSeconds >= MAX_VOICE_SECONDS_PER_DAY,
    searchLimitReached: searchCount >= MAX_SEARCHES_PER_DAY,
  };
}

export async function incrementMessageCount(userId: string): Promise<void> {
  const day = startOfUtcDay();
  await prisma.rateLimit.upsert({
    where: { userId_day: { userId, day } },
    update: { messageCount: { increment: 1 } },
    create: { userId, day, messageCount: 1 },
  });
}

export async function incrementVoiceSeconds(
  userId: string,
  seconds: number
): Promise<void> {
  if (seconds <= 0) return;
  const day = startOfUtcDay();
  await prisma.rateLimit.upsert({
    where: { userId_day: { userId, day } },
    update: { voiceSeconds: { increment: seconds } },
    create: { userId, day, voiceSeconds: seconds },
  });
}

// Searches are counted in bulk after a turn (the model may fire several), so
// this takes a count. Best-effort and post-response: must never throw into the
// user-facing path.
export async function incrementSearchCount(
  userId: string,
  by: number
): Promise<void> {
  if (by <= 0) return;
  const day = startOfUtcDay();
  await prisma.rateLimit.upsert({
    where: { userId_day: { userId, day } },
    update: { searchCount: { increment: by } },
    create: { userId, day, searchCount: by },
  });
}

function startOfUtcDay(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}
