-- AlterTable
ALTER TABLE "images" ADD COLUMN     "bucketKey" TEXT NOT NULL DEFAULT 'Altair';

-- AlterTable
ALTER TABLE "transformeds" ADD COLUMN     "bucketKey" TEXT NOT NULL DEFAULT 'Altair';
