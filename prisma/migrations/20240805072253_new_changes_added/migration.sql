/*
  Warnings:

  - You are about to drop the column `chemist` on the `doctor_details` table. All the data in the column will be lost.
  - You are about to drop the column `doc_name` on the `doctor_details` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `doctor_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_address" ADD COLUMN     "chemist" JSONB,
ADD COLUMN     "product" JSONB;

-- AlterTable
ALTER TABLE "doctor_details" DROP COLUMN "chemist",
DROP COLUMN "doc_name",
DROP COLUMN "products",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "headquaters" JSONB,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "visit_type" TEXT;

-- CreateTable
CREATE TABLE "schedule" (
    "id" SERIAL NOT NULL,
    "dr_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "schedule" JSONB,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_dr_id_fkey" FOREIGN KEY ("dr_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
