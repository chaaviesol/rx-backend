/*
  Warnings:

  - You are about to drop the column `sub_headquarter` on the `headquarters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "headquarters" DROP COLUMN "sub_headquarter";

-- CreateTable
CREATE TABLE "subHeadquarter" (
    "id" SERIAL NOT NULL,
    "headquarterId" INTEGER,
    "subheadquarter" TEXT,

    CONSTRAINT "subHeadquarter_pkey" PRIMARY KEY ("id")
);
