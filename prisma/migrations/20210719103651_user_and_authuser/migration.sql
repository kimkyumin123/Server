/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AuthUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uniqueValue` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "nickName" TEXT NOT NULL,
ADD COLUMN     "uniqueValue" TEXT NOT NULL,
ALTER COLUMN "userName" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_userId_unique" ON "AuthUser"("userId");
