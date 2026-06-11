import { getThreadMessagesAction } from "@/lib/actions/chat-thread";
import { type NextRequest, NextResponse } from "next/server";

const DENIAL_STATUS = { unauthorized: 401, forbidden: 403 } as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params;
  try {
    // Auth + ownership are gated in the action via a typed result.
    const result = await getThreadMessagesAction(threadId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.denial },
        { status: DENIAL_STATUS[result.denial] }
      );
    }
    return NextResponse.json(result.messages);
  } catch (error) {
    console.error("[API] /api/chat-threads/[threadId] GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
