import {
  getUserProfileAction,
  updateUserProfileAction,
} from "@/lib/actions/user-profile";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getUserProfileAction();
  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { content } = body;
  const profile = await updateUserProfileAction(content);
  return NextResponse.json(profile);
}
