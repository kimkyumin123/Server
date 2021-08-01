/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,placeId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewId,placeId,userId]` on the table `Suggestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqueValue]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment.reviewId_unique" ON "Comment"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Place.userId_unique" ON "Place"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review.userId_placeId_unique" ON "Review"("userId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion.reviewId_placeId_userId_unique" ON "Suggestion"("reviewId", "placeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.uniqueValue_unique" ON "User"("uniqueValue");
