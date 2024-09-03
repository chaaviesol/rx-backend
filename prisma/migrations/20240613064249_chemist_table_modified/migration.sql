/*
  Warnings:

  - You are about to drop the column `licence_number` on the `add_chemist` table. All the data in the column will be lost.
  - You are about to drop the column `rep_id` on the `add_chemist` table. All the data in the column will be lost.
  - You are about to drop the column `unique_RepId` on the `add_chemist` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `add_chemist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "add_chemist" DROP CONSTRAINT "add_chemist_rep_id_fkey";

-- AlterTable
ALTER TABLE "add_chemist" DROP COLUMN "licence_number",
DROP COLUMN "rep_id",
DROP COLUMN "unique_RepId",
ADD COLUMN     "creator_id" INTEGER NOT NULL,
ADD COLUMN     "license_number" TEXT,
ADD COLUMN     "unique_Id" INTEGER,
ALTER COLUMN "address" SET DATA TYPE TEXT;
