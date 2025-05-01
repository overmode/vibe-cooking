import { getPlannedMealsMetadataAction } from "@/lib/actions/planned-meals";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const plannedMeals = await getPlannedMealsMetadataAction();
    return NextResponse.json(plannedMeals);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
