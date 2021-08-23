/*
  Warnings:

  - Added the required column `reviewId` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey1";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "reviewId" INTEGER NOT NULL,
ALTER COLUMN "x" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "y" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;
