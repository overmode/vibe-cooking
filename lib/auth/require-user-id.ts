import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { DENIAL_STATUS } from "@/lib/api/denial";

// Route-boundary auth guard: returns the authenticated userId, or a ready-to-
// return 401 response. Callers narrow on the `response` branch and bail early.
export async function requireUserId(): Promise<
  | { userId: string; response?: never }
  | { userId?: never; response: NextResponse }
> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: DENIAL_STATUS.unauthorized }
      ),
    };
  }
  return { userId };
}
