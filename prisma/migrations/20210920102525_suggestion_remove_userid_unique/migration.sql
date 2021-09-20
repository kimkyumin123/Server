-- DropIndex
DROP INDEX "Suggestion.reviewId_userId_unique";

-- RenameIndex
ALTER INDEX "Suggestion_reviewId_unique" RENAME TO "Suggestion.reviewId_unique";
