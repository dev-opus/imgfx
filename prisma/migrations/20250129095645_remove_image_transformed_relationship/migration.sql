/*
  Warnings:

  - You are about to drop the column `imageId` on the `transformeds` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transformeds" DROP CONSTRAINT "transformeds_imageId_fkey";

-- AlterTable
ALTER TABLE "transformeds" DROP COLUMN "imageId";
