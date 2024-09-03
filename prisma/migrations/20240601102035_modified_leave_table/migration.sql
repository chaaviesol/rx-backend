/*
  Warnings:

  - You are about to drop the column `rep_id` on the `expense_report` table. All the data in the column will be lost.
  - You are about to drop the column `rep_id` on the `leave_table` table. All the data in the column will be lost.
  - Added the required column `requester_id` to the `expense_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requester_id` to the `leave_table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "expense_report" DROP CONSTRAINT "expense_report_rep_id_fkey";

-- DropForeignKey
ALTER TABLE "leave_table" DROP CONSTRAINT "leave_table_rep_id_fkey";

-- AlterTable
ALTER TABLE "expense_report" DROP COLUMN "rep_id",
ADD COLUMN     "requester_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "leave_table" DROP COLUMN "rep_id",
ADD COLUMN     "requester_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "leave_table" ADD CONSTRAINT "leave_table_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
