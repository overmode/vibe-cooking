import { describe, it, expect, vi, afterAll } from 'vitest'
import { createRecipeAction } from '@/lib/actions/recipe'
import prisma from '@/prisma/client'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth

describe('Recipe Creation Deadlock Tests', () => {
  const testUserIds: string[] = []

  afterAll(async () => {
    // Cleanup all test users at the end
    if (testUserIds.length > 0) {
      try {
        await prisma.recipe.deleteMany({
          where: { 
            userId: { in: testUserIds }
          }
        })
        console.log(`Cleaned up ${testUserIds.length} test users`)
      } catch (error) {
        console.error('Cleanup failed:', error)
      }
    }
    await prisma.$disconnect()
  })

  it('should handle parallel recipe creation without deadlock', async () => {
    // Unique user ID per test
    const testUserId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    testUserIds.push(testUserId)
    
    mockAuth.mockResolvedValue({ 
      userId: testUserId,
      sessionClaims: {},
      sessionId: 'test-session',
      sessionStatus: 'active',
      actor: null,
      getToken: vi.fn(),
      has: vi.fn(),
      debug: vi.fn()
    } as any)

    const recipeData = {
      name: 'Deadlock Test Recipe',
      servings: 4,
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Test instructions'
    }

    // Create 10 recipes in parallel to trigger potential deadlock
    const promises = Array.from({ length: 10 }, (_, i) => 
      createRecipeAction({
        ...recipeData,
        name: `${recipeData.name} ${i + 1}`
      })
    )

    const results = await Promise.allSettled(promises)

    // Debug: Log all results to see what we're getting
    results.forEach((result, index) => {
      console.log(`Result ${index}:`, result.status, 
        result.status === 'fulfilled' ? result.value : result.reason)
    })

    // Count rejected promises (these are likely deadlock errors)
    const rejectedPromises = results.filter(result => result.status === 'rejected')
    
    console.log(`Found ${rejectedPromises.length} rejected promises out of ${results.length} requests`)
    
    // Test FAILS if any promises were rejected (likely due to deadlocks)
    expect(rejectedPromises).toHaveLength(0)
    
    console.log(`Test completed with user: ${testUserId}`)
  })
})