/*
  Warnings:

  - Changed the type of `like` on the `Suggestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unLike` on the `Suggestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Suggestion" DROP COLUMN "like",
ADD COLUMN     "like" BOOLEAN NOT NULL,
DROP COLUMN "unLike",
ADD COLUMN     "unLike" BOOLEAN NOT NULL;
