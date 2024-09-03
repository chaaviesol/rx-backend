/*
  Warnings:

  - The `manager_uniqueId` column on the `leave_table` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "leave_table" DROP COLUMN "manager_uniqueId",
ADD COLUMN     "manager_uniqueId" INTEGER;
