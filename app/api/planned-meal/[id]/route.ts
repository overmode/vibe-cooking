import { getPlannedMealByIdAction } from "@/lib/actions/planned-meals";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    //Auth is done in the action
    const plannedMeal = await getPlannedMealByIdAction(id);
    return NextResponse.json(plannedMeal);
  } catch {
    // TODO better error handling with custom error classes and status codes
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}