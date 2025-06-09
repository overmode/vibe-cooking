import {
  getUserDietaryPreferencesAction,
  updateUserDietaryPreferencesAction,
} from "@/lib/actions/preferences";
import { NextResponse } from "next/server";

export async function GET() {
  const preferences = await getUserDietaryPreferencesAction();
  return NextResponse.json(preferences);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { preferences } = body;
  const updatedPreferences = await updateUserDietaryPreferencesAction(
    preferences
  );
  return NextResponse.json(updatedPreferences);
}
