/*
  Warnings:

  - You are about to drop the column `userId` on the `Place` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_userId_fkey";

-- DropIndex
DROP INDEX "Place.userId_unique";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_PlaceToReview" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlaceToReview_AB_unique" ON "_PlaceToReview"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaceToReview_B_index" ON "_PlaceToReview"("B");

-- AddForeignKey
ALTER TABLE "_PlaceToReview" ADD FOREIGN KEY ("A") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToReview" ADD FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
