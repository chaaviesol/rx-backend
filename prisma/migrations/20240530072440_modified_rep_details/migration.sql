/*
  Warnings:

  - You are about to drop the column `manager_id` on the `add_chemist` table. All the data in the column will be lost.
  - Added the required column `rep_id` to the `add_chemist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "add_chemist" DROP COLUMN "manager_id",
ADD COLUMN     "rep_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rep_details" ADD COLUMN     "reporting_officer" INTEGER;

-- AddForeignKey
ALTER TABLE "add_chemist" ADD CONSTRAINT "add_chemist_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
