import { getThreadsAction } from "@/lib/actions/chat-thread";
import { DENIAL_STATUS } from "@/lib/api/denial";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Auth is gated in the action via a typed result.
    const result = await getThreadsAction();
    if (!result.ok) {
      return NextResponse.json(
        { error: result.denial },
        { status: DENIAL_STATUS[result.denial] }
      );
    }
    return NextResponse.json(result.threads);
  } catch (error) {
    console.error("[API] /api/chat-threads GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
