/*
  Warnings:

  - You are about to drop the `travel_plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "travel_plan";

-- CreateTable
CREATE TABLE "travelPlan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "month" TEXT,
    "status" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travelPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailedTravelPlan" (
    "id" SERIAL NOT NULL,
    "travelplan_id" INTEGER NOT NULL,
    "dr_id" INTEGER,
    "user_id" INTEGER,
    "date" TEXT,
    "status" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detailedTravelPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "detailedTravelPlan" ADD CONSTRAINT "detailedTravelPlan_travelplan_id_fkey" FOREIGN KEY ("travelplan_id") REFERENCES "travelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
