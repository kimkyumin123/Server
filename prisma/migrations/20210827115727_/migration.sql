/*
  Warnings:

  - You are about to drop the column `reviewId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the `_PlaceToReview` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reviewRoomId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToReview" DROP CONSTRAINT "_PlaceToReview_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaceToReview" DROP CONSTRAINT "_PlaceToReview_B_fkey";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewRoomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PlaceToReview";

-- CreateTable
CREATE TABLE "ReviewRoom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("reviewRoomId") REFERENCES "ReviewRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
