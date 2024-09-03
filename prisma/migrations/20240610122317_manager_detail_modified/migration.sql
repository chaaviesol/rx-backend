/*
  Warnings:

  - You are about to drop the column `unique_manager_code` on the `manager_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "manager_details" DROP COLUMN "unique_manager_code",
ADD COLUMN     "unique_id" TEXT;
