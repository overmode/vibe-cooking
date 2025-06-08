import { deleteRecipeAction, getRecipeByIdAction } from '@/lib/actions/recipe'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    //Auth is done in the action
    const recipe = await getRecipeByIdAction(id)
    return NextResponse.json(recipe)
  } catch (error) {
    // Handle recipe not found vs other errors
    if (error instanceof Error && error.message.includes('Recipe not found')) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }
    
    // Log the actual error for debugging
    console.error('[API] /api/recipe/[id] GET error:', error)
    
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
    //Auth is done in the action
    await deleteRecipeAction({ recipeId: id })
    return NextResponse.json({ success: true })
  } catch {
    // TODO better error handling with custom error classes and status codes
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
