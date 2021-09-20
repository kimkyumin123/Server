/*
  Warnings:

  - A unique constraint covering the columns `[reviewId,userId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Suggestion.reviewId_userId_unique" ON "Suggestion"("reviewId", "userId");

-- RenameIndex
ALTER INDEX "Suggestion.reviewId_unique" RENAME TO "Suggestion_reviewId_unique";
