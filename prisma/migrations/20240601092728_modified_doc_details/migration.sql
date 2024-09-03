/*
  Warnings:

  - You are about to drop the column `address` on the `doctor_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_details" DROP COLUMN "address",
ALTER COLUMN "created_UId" SET DATA TYPE TEXT;
