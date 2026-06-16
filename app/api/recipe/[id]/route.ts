import { deleteRecipeAction, getRecipeByIdAction } from "@/lib/actions/recipe";
import { requireUserId } from "@/lib/auth/require-user-id";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const { id } = await params;
  try {
    const recipe = await getRecipeByIdAction(userId, id);
    return NextResponse.json(recipe);
  } catch (error) {
    // Handle recipe not found vs other errors
    if (error instanceof Error && error.message.includes("Recipe not found")) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Log the actual error for debugging
    console.error("[API] /api/recipe/[id] GET error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const { id } = await params;
  try {
    await deleteRecipeAction(userId, id);
    return NextResponse.json({ success: true });
  } catch {
    // TODO better error handling with custom error classes and status codes
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
