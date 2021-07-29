/*
  Warnings:

  - You are about to drop the `AuthUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentToHashTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[placeId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthUser" DROP CONSTRAINT "AuthUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToHashTag" DROP CONSTRAINT "_CommentToHashTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentToHashTag" DROP CONSTRAINT "_CommentToHashTag_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL;

-- DropTable
DROP TABLE "AuthUser";

-- DropTable
DROP TABLE "_CommentToHashTag";

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_placeId_unique" ON "Suggestion"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_reviewId_unique" ON "Suggestion"("reviewId");
