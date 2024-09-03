/*
  Warnings:

  - You are about to drop the column `manager_id` on the `add_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "add_product" DROP COLUMN "manager_id",
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "quantity" INTEGER;

-- AlterTable
ALTER TABLE "manager_details" ALTER COLUMN "address" SET DATA TYPE TEXT;
