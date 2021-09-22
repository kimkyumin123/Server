-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "Suggestion" ADD FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
