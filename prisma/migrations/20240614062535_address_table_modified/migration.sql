/*
  Warnings:

  - You are about to drop the column `headquarters_id` on the `doctor_address` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters_id` on the `doctor_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_address" DROP COLUMN "headquarters_id",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT;

-- AlterTable
ALTER TABLE "doctor_details" DROP COLUMN "headquarters_id",
ADD COLUMN     "address_id" INTEGER;

-- AddForeignKey
ALTER TABLE "doctor_address" ADD CONSTRAINT "doctor_address_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
