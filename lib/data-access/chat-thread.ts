import prisma from "@/prisma/client";
import { type Prisma, MessageRole } from "@/generated/prisma/client";
import { handleDbError } from "@/lib/utils/error";
import { type ThreadMetadata } from "@/lib/types";
import { validateUIMessages, type UIMessage } from "ai";

export async function saveThreadMessages({
  userId,
  threadId,
  recipeId,
  messages,
}: {
  userId: string;
  threadId: string;
  recipeId: string | null;
  messages: UIMessage[];
}): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      // Scope the touch by userId so a thread id owned by someone else is a
      // no-op rather than a cross-user write — a structural backstop to the
      // route's ownership check. A genuinely new id falls through to create;
      // an id taken by another user hits the PK constraint and fails loud.
      const touched = await tx.chatThread.updateMany({
        where: { id: threadId, userId },
        data: { updatedAt: new Date() },
      });
      if (touched.count === 0) {
        await tx.chatThread.create({
          data: { id: threadId, userId, recipeId },
        });
      }

      for (const message of messages) {
        const role = toMessageRole(message.role);
        if (!role) continue;
        // Assistant turns can finish empty (aborted/errored stream); they carry
        // nothing and break the read-side validator. User parts are guaranteed
        // upstream, so an empty one there would be a real bug — don't mask it.
        if (role === MessageRole.ASSISTANT && message.parts.length === 0) continue;
        // Parts are JSON-serializable but the AI SDK union isn't structurally
        // InputJsonValue (optional undefineds), so assert at this one boundary.
        const parts = message.parts as Prisma.InputJsonValue;
        await tx.chatMessage.upsert({
          where: { id: message.id },
          create: { id: message.id, threadId, role, parts },
          update: { parts },
        });
      }
    });
  } catch (error) {
    handleDbError(error, "save thread messages");
  }
}

export async function getThreadsByUserId({
  userId,
}: {
  userId: string;
}): Promise<ThreadMetadata[]> {
  try {
    // Main-assistant threads only (recipeId null); recipe threads live in their
    // recipe view. Covered by @@index([userId, recipeId, updatedAt]).
    return await prisma.chatThread.findMany({
      where: { userId, recipeId: null },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    });
  } catch (error) {
    handleDbError(error, "get threads by user id");
  }
}

export async function getThreadWithMessages({
  threadId,
}: {
  threadId: string;
}): Promise<{
  userId: string;
  title: string | null;
  messages: UIMessage[];
} | null> {
  try {
    const thread = await prisma.chatThread.findUnique({
      where: { id: threadId },
      select: {
        userId: true,
        title: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: { id: true, role: true, parts: true },
        },
      },
    });
    if (!thread) return null;
    // Validate the envelope instead of blind-casting. Throws on a malformed row
    // (all-or-nothing), caught below and surfaced as a 500.
    const messages = await validateUIMessages({
      messages: thread.messages.map((row) => ({
        id: row.id,
        role: row.role === MessageRole.ASSISTANT ? "assistant" : "user",
        parts: row.parts,
      })),
    });
    return {
      userId: thread.userId,
      title: thread.title,
      messages,
    };
  } catch (error) {
    handleDbError(error, "get thread with messages");
  }
}

export async function updateThreadTitle({
  threadId,
  userId,
  title,
}: {
  threadId: string;
  userId: string;
  title: string;
}): Promise<void> {
  try {
    // Scoped by userId as a structural backstop to the route's ownership check.
    await prisma.chatThread.updateMany({
      where: { id: threadId, userId },
      data: { title },
    });
  } catch (error) {
    handleDbError(error, "update thread title");
  }
}

// UIMessage roles include "system"; only user/assistant turns are persisted.
function toMessageRole(role: UIMessage["role"]): MessageRole | null {
  if (role === "user") return MessageRole.USER;
  if (role === "assistant") return MessageRole.ASSISTANT;
  return null;
}
