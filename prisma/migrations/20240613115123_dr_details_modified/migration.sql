-- DropForeignKey
ALTER TABLE "doctor_address" DROP CONSTRAINT "doctor_address_doc_id_fkey";

-- AlterTable
ALTER TABLE "doctor_details" ADD COLUMN     "headquarters_id" INTEGER;
