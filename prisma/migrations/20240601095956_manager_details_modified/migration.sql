/*
  Warnings:

  - The `created_date` column on the `manager_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "manager_details" DROP COLUMN "created_date",
ADD COLUMN     "created_date" TIMESTAMP(3);
