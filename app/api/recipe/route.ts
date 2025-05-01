import { getRecipesMetadataAction } from "@/lib/actions/recipe";
import { NextResponse } from "next/server";

export async function GET() {
  const recipes = await getRecipesMetadataAction();
  return NextResponse.json(recipes);
}