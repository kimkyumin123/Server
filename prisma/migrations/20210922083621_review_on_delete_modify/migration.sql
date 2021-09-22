-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_placeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewRoomId_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD FOREIGN KEY ("reviewRoomId") REFERENCES "ReviewRoom"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
