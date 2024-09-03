-- CreateTable
CREATE TABLE "travel_plan" (
    "id" SERIAL NOT NULL,
    "requester_id" INTEGER,
    "headquarters" TEXT,
    "date" TEXT,
    "amount" TEXT,
    "created_date" TIMESTAMP(3),
    "accepted_date" TIMESTAMP(3),
    "accepted_by" INTEGER,

    CONSTRAINT "travel_plan_pkey" PRIMARY KEY ("id")
);
