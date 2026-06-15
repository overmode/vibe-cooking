import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/lib/actions/user-profile";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({ content: z.string() });

export async function GET() {
  const profile = await getUserProfileAction();
  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const profile = await updateUserProfileAction(parsed.data.content);
  return NextResponse.json(profile);
}
