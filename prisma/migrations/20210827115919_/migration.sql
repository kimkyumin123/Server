-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewRoomId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "reviewRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("reviewRoomId") REFERENCES "ReviewRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
