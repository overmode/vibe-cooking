import {
  getPlannedMealByIdAction,
  updatePlannedMealAction,
  deletePlannedMealAction,
} from '@/lib/actions/planned-meals'
import { NextRequest, NextResponse } from 'next/server'
import { updatePlannedMealInputSchema } from '@/lib/validators/plannedMeals'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    //Auth is done in the action
    const plannedMeal = await getPlannedMealByIdAction(id)
    return NextResponse.json(plannedMeal)
  } catch (error) {
    // Handle planned meal not found vs other errors
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Planned meal not found' },
        { status: 404 }
      )
    }
    
    // Log the actual error for debugging
    console.error('[API] /api/planned-meal/[id] GET error:', error)
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const updatePlannedMealInputParsed =
    updatePlannedMealInputSchema.safeParse(body)
  if (updatePlannedMealInputParsed.error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Detect id mismatch
  if (updatePlannedMealInputParsed.data.id !== id) {
    return NextResponse.json({ error: 'ID mismatch' }, { status: 400 })
  }

  // Auth is done in the action
  try {
    const updatedPlannedMeal = await updatePlannedMealAction(
      updatePlannedMealInputParsed.data
    )
    return NextResponse.json(updatedPlannedMeal)
  } catch {
    // TODO better error handling with custom error classes and status codes
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await deletePlannedMealAction(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    // Handle planned meal not found vs other errors
    if (error instanceof Error && error.message.includes('Planned meal not found')) {
      return NextResponse.json(
        { error: 'Planned meal not found' },
        { status: 404 }
      )
    }
    
    // Log the actual error for debugging
    console.error('[API] /api/planned-meal/[id] DELETE error:', error)
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
