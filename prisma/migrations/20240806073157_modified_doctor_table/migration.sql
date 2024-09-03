-- AlterTable
ALTER TABLE "doctor_address" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "schedule" ALTER COLUMN "user_id" SET DATA TYPE TEXT;
