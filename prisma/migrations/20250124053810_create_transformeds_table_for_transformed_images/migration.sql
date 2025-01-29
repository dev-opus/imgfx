-- CreateTable
CREATE TABLE "transformeds" (
    "id" SERIAL NOT NULL,
    "bucketUrl" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transformeds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transformeds" ADD CONSTRAINT "transformeds_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
