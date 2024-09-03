-- CreateTable
CREATE TABLE "visit_record" (
    "id" SERIAL NOT NULL,
    "requesterId" INTEGER,
    "requesterUniqueId" TEXT,
    "dr_Id" INTEGER,
    "total_visits" INTEGER,
    "visited" INTEGER,
    "balance_visit" INTEGER,
    "date" TEXT,
    "dateTime" TIMESTAMP(3),

    CONSTRAINT "visit_record_pkey" PRIMARY KEY ("id")
);
