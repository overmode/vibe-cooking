import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'
import { MAX_MESSAGES_PER_DAY } from '@/lib/constants/app_validation'

export const chatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(MAX_MESSAGES_PER_DAY, '1 d'),
  analytics: true,
})
