/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review.userId_placeId_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Review.userId_unique" ON "Review"("userId");
