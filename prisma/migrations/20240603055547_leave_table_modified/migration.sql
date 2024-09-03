/*
  Warnings:

  - You are about to drop the column `uniqueRep_Id` on the `leave_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "leave_table" DROP COLUMN "uniqueRep_Id",
ADD COLUMN     "uniqueRequester_Id" INTEGER,
ALTER COLUMN "requester_id" DROP NOT NULL;
