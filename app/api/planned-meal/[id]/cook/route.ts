import { NextRequest, NextResponse } from "next/server";
import { updateStatus } from "@/lib/actions/planned-meals";
import { PlannedMealStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  const plannedMeal = await updateStatus(id, PlannedMealStatus.COOKED);
  return NextResponse.json(plannedMeal);
}