/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Place.uniqueId_unique" ON "Place"("uniqueId");
