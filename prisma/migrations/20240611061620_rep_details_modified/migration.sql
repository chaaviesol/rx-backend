/*
  Warnings:

  - You are about to drop the column `rep_name` on the `rep_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rep_details" DROP COLUMN "rep_name",
ADD COLUMN     "name" TEXT;
