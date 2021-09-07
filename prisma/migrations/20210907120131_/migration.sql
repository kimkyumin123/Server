-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewRoomId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("reviewRoomId") REFERENCES "ReviewRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
