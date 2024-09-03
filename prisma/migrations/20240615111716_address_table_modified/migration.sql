/*
  Warnings:

  - You are about to drop the column `latitude` on the `doctor_address` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `doctor_address` table. All the data in the column will be lost.
  - The `address` column on the `doctor_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `address_id` column on the `doctor_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "doctor_address" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "address",
ADD COLUMN     "address" JSONB;

-- AlterTable
ALTER TABLE "doctor_details" DROP COLUMN "address_id",
ADD COLUMN     "address_id" JSONB;
