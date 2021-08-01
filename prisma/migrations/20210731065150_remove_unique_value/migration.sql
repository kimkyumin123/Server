/*
  Warnings:

  - You are about to drop the column `uniqueValue` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User.uniqueValue_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uniqueValue";
