/*
  Warnings:

  - You are about to drop the column `address` on the `doctor_address` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `doctor_address` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `doctor_address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "add_chemist" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "doctor_address" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "headquarters_id" INTEGER;

-- CreateTable
CREATE TABLE "headquarters" (
    "id" SERIAL NOT NULL,
    "headquarter_name" TEXT,
    "sub_headquarter" TEXT,

    CONSTRAINT "headquarters_pkey" PRIMARY KEY ("id")
);
