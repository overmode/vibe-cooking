import { NextRequest, NextResponse } from 'next/server'
import { createPlannedMealAction } from '@/lib/actions/planned-meals'
import { PlannedMealStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const plannedMeal = await createPlannedMealAction({
    recipeId: id,
    status: PlannedMealStatus.PLANNED,
  })
  return NextResponse.json(plannedMeal)
}
