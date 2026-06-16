import { getRecipesMetadataAction } from "@/lib/actions/recipe";
import { requireUserId } from "@/lib/auth/require-user-id";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const recipes = await getRecipesMetadataAction(userId);
  return NextResponse.json(recipes);
}
