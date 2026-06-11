import { type UIMessage } from "ai";
import {
  getThreadsByUserId,
  getThreadWithMessages,
} from "@/lib/data-access/chat-thread";
import { getCurrentUserId } from "@/lib/auth/get-current-user-id";
import { type Denial } from "@/lib/api/denial";
import { type ThreadMetadata } from "@/lib/types";

export type ThreadMessagesResult =
  | { ok: true; messages: UIMessage[] }
  | { ok: false; denial: Denial };

export type ThreadsResult =
  | { ok: true; threads: ThreadMetadata[] }
  | { ok: false; denial: "unauthorized" };

export const getThreadsAction = async (): Promise<ThreadsResult> => {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, denial: "unauthorized" };
  const threads = await getThreadsByUserId({ userId });
  return { ok: true, threads };
};

export const getThreadMessagesAction = async (
  threadId: string
): Promise<ThreadMessagesResult> => {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, denial: "unauthorized" };
  // A null thread is a brand-new client-minted id whose first turn hasn't
  // persisted yet, so it legitimately reads as empty. A foreign thread is a
  // loud 403, not a silent empty read. Genuine DB errors throw from the data
  // layer and surface as a 500.
  const thread = await getThreadWithMessages({ threadId });
  if (!thread) return { ok: true, messages: [] };
  if (thread.userId !== userId) return { ok: false, denial: "forbidden" };
  return { ok: true, messages: thread.messages };
};
