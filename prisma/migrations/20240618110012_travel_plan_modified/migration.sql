/*
  Warnings:

  - You are about to drop the column `date` on the `travel_plan` table. All the data in the column will be lost.
  - You are about to drop the column `headquarters` on the `travel_plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "travel_plan" DROP COLUMN "date",
DROP COLUMN "headquarters",
ADD COLUMN     "headquarters_date" JSONB;
