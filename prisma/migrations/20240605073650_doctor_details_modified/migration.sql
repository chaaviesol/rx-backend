-- AlterTable
ALTER TABLE "doctor_details" ADD COLUMN     "modified_by" TEXT,
ADD COLUMN     "modified_date" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ALTER COLUMN "created_date" DROP NOT NULL;
