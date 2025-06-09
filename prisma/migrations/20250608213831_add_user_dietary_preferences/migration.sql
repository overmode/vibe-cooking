-- CreateTable
CREATE TABLE "UserDietaryPreferences" (
    "userId" TEXT NOT NULL,
    "preferences" VARCHAR(10000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDietaryPreferences_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDietaryPreferences_userId_key" ON "UserDietaryPreferences"("userId");
