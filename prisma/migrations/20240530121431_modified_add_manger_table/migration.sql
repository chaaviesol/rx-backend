/*
  Warnings:

  - You are about to drop the column `created_by` on the `doctor_details` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_details" DROP CONSTRAINT "doctor_details_created_by_fkey";

-- AlterTable
ALTER TABLE "add_chemist" ADD COLUMN     "unique_RepId" INTEGER;

-- AlterTable
ALTER TABLE "doctor_details" DROP COLUMN "created_by",
ADD COLUMN     "created_UId" INTEGER;

-- AlterTable
ALTER TABLE "expense_report" ADD COLUMN     "uniqueRepId" INTEGER;

-- AlterTable
ALTER TABLE "leave_table" ADD COLUMN     "uniqueRep_Id" INTEGER;

-- AlterTable
ALTER TABLE "manager_details" ADD COLUMN     "created_date" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "unique_manager_code" TEXT;

-- AlterTable
ALTER TABLE "rep_details" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "reporting_details" ADD COLUMN     "unique_reqId" INTEGER;
