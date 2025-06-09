import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// This is used to keep the supabase database alive. Needed for the free tier.
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.recipe.findFirst();

    return NextResponse.json("success");
  } catch (error) {
    console.error("Supabase keepalive failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
