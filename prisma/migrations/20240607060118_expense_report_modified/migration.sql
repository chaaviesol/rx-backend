/*
  Warnings:

  - You are about to drop the column `uniqueReqesterId` on the `expense_report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expense_report" DROP COLUMN "uniqueReqesterId",
ADD COLUMN     "uniqueRequesterId" TEXT;
