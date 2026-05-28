import prisma from '@/prisma/client'
import { MAX_MESSAGES_PER_DAY } from '@/lib/constants/app_validation'

export const chatLimiter = {
  async limit(userId: string): Promise<{ success: boolean }> {
    const day = startOfUtcDay(new Date())

    const row = await prisma.rateLimit.upsert({
      where: { userId_day: { userId, day } },
      update: { messageCount: { increment: 1 } },
      create: { userId, day, messageCount: 1 },
    })

    return { success: row.messageCount <= MAX_MESSAGES_PER_DAY }
  },
}

function startOfUtcDay(date: Date): Date {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}
