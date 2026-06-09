/*
  Warnings:

  - You are about to drop the `CookSession` table. If the table is not empty, all the data it contains will be lost.
*/
-- DropForeignKey
ALTER TABLE "CookSession" DROP CONSTRAINT "CookSession_recipeId_fkey";

-- DropTable
DROP TABLE "CookSession";
