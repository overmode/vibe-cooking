import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/require-user-id";
import { getLimits } from "@/lib/rate-limiter";

export async function GET() {
  const { userId, response } = await requireUserId();
  if (response) return response;

  return NextResponse.json(await getLimits(userId));
}
