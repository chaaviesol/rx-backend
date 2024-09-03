-- CreateTable
CREATE TABLE "userData" (
    "id" SERIAL NOT NULL,
    "uniqueId" TEXT,
    "name" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "address" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "nationality" TEXT,
    "qualification" TEXT,
    "headquaters" JSONB,
    "role" TEXT,
    "password" TEXT,
    "reportingOfficer_id" INTEGER,
    "createdBy" INTEGER,
    "adminId" INTEGER,
    "reporting_type" TEXT,

    CONSTRAINT "userData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userData_uniqueId_key" ON "userData"("uniqueId");
