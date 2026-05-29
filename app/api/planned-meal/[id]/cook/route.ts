import { NextRequest, NextResponse } from 'next/server'
import { updateStatus } from '@/lib/actions/planned-meals'
import { RecipeInstanceStatus } from '@/generated/prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const plannedMeal = await updateStatus(id, RecipeInstanceStatus.COOKED)
  return NextResponse.json(plannedMeal)
}
