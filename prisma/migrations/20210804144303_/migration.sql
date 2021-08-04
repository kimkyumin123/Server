/*
  Warnings:

  - You are about to drop the column `placeId` on the `Suggestion` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId,userId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_placeId_fkey";

-- DropIndex
DROP INDEX "Suggestion.reviewId_placeId_userId_unique";

-- DropIndex
DROP INDEX "Suggestion_placeId_unique";

-- AlterTable
ALTER TABLE "Suggestion" DROP COLUMN "placeId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken",
ADD COLUMN     "token" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion.reviewId_userId_unique" ON "Suggestion"("reviewId", "userId");
