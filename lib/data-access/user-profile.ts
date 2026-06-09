import prisma from "@/prisma/client";
import { Author } from "@/generated/prisma/client";
import { handleDbError } from "../utils/error";

export async function getLatestUserProfileRevision({
  userId,
}: {
  userId: string;
}) {
  try {
    return await prisma.userProfileRevision.findFirst({
      where: { userId },
      orderBy: { revision: "desc" },
    });
  } catch (error) {
    handleDbError(error, "get latest user profile revision");
  }
}

export async function appendUserProfileRevision({
  userId,
  content,
  authoredBy,
}: {
  userId: string;
  content: string;
  authoredBy: Author;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const latest = await tx.userProfileRevision.findFirst({
        where: { userId },
        orderBy: { revision: "desc" },
        select: { revision: true },
      });

      const nextRevision = latest ? latest.revision + 1 : 1;

      return tx.userProfileRevision.create({
        data: {
          userId,
          content,
          authoredBy,
          revision: nextRevision,
        },
      });
    });
  } catch (error) {
    handleDbError(error, "append user profile revision");
  }
}
