-- AlterTable
ALTER TABLE "User" ADD COLUMN     "revisionInterval" INTEGER NOT NULL DEFAULT 14;

-- CreateTable
CREATE TABLE "BodyRevision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION,
    "chestCm" DOUBLE PRECISION,
    "waistCm" DOUBLE PRECISION,
    "armsCm" DOUBLE PRECISION,
    "legsCm" DOUBLE PRECISION,
    "notes" TEXT,
    "photoFront" TEXT,
    "photoBack" TEXT,
    "photoSide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyRevision_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BodyRevision" ADD CONSTRAINT "BodyRevision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
