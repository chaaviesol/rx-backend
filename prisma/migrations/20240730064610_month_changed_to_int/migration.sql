/*
  Warnings:

  - The `month` column on the `travelPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "travelPlan" DROP COLUMN "month",
ADD COLUMN     "month" INTEGER;
