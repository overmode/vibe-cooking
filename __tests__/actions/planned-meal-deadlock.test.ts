import { describe, it, expect, vi, afterAll } from 'vitest'
import { createPlannedMealAction } from '@/lib/actions/planned-meals'
import { createRecipeAction } from '@/lib/actions/recipe'
import prisma from '@/prisma/client'
import { PlannedMealStatus } from '@prisma/client'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

const mockAuth = vi.mocked(await import('@clerk/nextjs/server')).auth

describe('Planned Meal Creation Deadlock Tests', () => {
  const testUserIds: string[] = []
  const testRecipeIds: string[] = []

  afterAll(async () => {
    // Cleanup all test data at the end
    if (testUserIds.length > 0) {
      try {
        await prisma.plannedMeal.deleteMany({
          where: { 
            userId: { in: testUserIds }
          }
        })
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

  it('should handle parallel planned meal creation without deadlock', async () => {
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

    // First, create a recipe to plan meals from
    const recipe = await createRecipeAction({
      name: 'Test Recipe for Planning',
      servings: 4,
      ingredients: ['ingredient1', 'ingredient2'],
      instructions: 'Test instructions'
    })

    if (!recipe?.id) {
      throw new Error('Failed to create test recipe')
    }
    testRecipeIds.push(recipe.id)

    const plannedMealData = {
      recipeId: recipe.id,
      status: PlannedMealStatus.PLANNED
    }

    // Create 10 planned meals in parallel to trigger potential deadlock
    const promises = Array.from({ length: 10 }, (_, i) => 
      createPlannedMealAction({
        ...plannedMealData,
        overrideName: `Planned Meal ${i + 1}`
      })
    )

    const results = await Promise.allSettled(promises)

    // Debug: Log all results to see what we're getting
    results.forEach((result, index) => {
      console.log(`Result ${index}:`, result.status, 
        result.status === 'fulfilled' ? result.value?.id : result.reason?.message)
    })

    // Count rejected promises (these would be deadlock errors)
    const rejectedPromises = results.filter(result => result.status === 'rejected')
    
    console.log(`Found ${rejectedPromises.length} rejected promises out of ${results.length} requests`)
    
    // Test FAILS if any promises were rejected (likely due to deadlocks)
    expect(rejectedPromises).toHaveLength(0)
    
    console.log(`Test completed with user: ${testUserId}`)
  })
})