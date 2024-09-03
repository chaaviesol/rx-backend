/*
  Warnings:

  - You are about to drop the column `uniqueRepId` on the `expense_report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "expense_report" DROP CONSTRAINT "expense_report_requester_id_fkey";

-- AlterTable
ALTER TABLE "expense_report" DROP COLUMN "uniqueRepId",
ADD COLUMN     "uniqueReqesterId" TEXT,
ALTER COLUMN "requester_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "leave_table" ALTER COLUMN "uniqueRequester_Id" SET DATA TYPE TEXT;
