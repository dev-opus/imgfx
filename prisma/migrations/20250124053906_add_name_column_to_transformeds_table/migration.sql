/*
  Warnings:

  - Added the required column `name` to the `transformeds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transformeds" ADD COLUMN     "name" TEXT NOT NULL;
