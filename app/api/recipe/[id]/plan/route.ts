import { NextRequest, NextResponse } from 'next/server'
import { createPlannedMealAction } from '@/lib/actions/planned-meals'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const plannedMeal = await createPlannedMealAction({
    templateId: id,
  })
  return NextResponse.json(plannedMeal)
}
