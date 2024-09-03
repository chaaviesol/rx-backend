/*
  Warnings:

  - You are about to drop the column `creator_id` on the `add_chemist` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `add_chemist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "add_chemist" DROP COLUMN "creator_id",
ADD COLUMN     "created_by" INTEGER NOT NULL;
