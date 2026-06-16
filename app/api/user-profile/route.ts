import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/lib/actions/user-profile";
import { requireUserId } from "@/lib/auth/require-user-id";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_USER_PROFILE_LENGTH } from "@/lib/constants/app_validation";

const updateProfileSchema = z.object({
  content: z.string().max(MAX_USER_PROFILE_LENGTH),
});

export async function GET() {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const profile = await getUserProfileAction(userId);
  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const body: unknown = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const profile = await updateUserProfileAction(userId, parsed.data.content);
  return NextResponse.json(profile);
}
