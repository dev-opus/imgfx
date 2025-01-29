/*
  Warnings:

  - A unique constraint covering the columns `[bucketUrl]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_bucketUrl_key" ON "images"("bucketUrl");
