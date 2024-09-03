-- CreateTable
CREATE TABLE "rep_details" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT,
    "rep_name" TEXT,
    "gender" TEXT,
    "date_of_birth" TEXT,
    "Nationality" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "designation" TEXT,
    "qualification" TEXT,
    "address" TEXT,
    "created_by" INTEGER,
    "created_date" TIMESTAMP(3),

    CONSTRAINT "rep_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_details" (
    "id" SERIAL NOT NULL,
    "doc_name" TEXT,
    "doc_qualification" TEXT,
    "gender" TEXT,
    "specialization" TEXT,
    "mobile" TEXT,
    "no_of_visits" INTEGER,
    "date_of_birth" TEXT,
    "wedding_date" TEXT,
    "address" JSONB,
    "products" JSONB,
    "chemist" JSONB,
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_address" (
    "id" SERIAL NOT NULL,
    "doc_id" INTEGER NOT NULL,
    "address" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "created_date" TIMESTAMP(3),

    CONSTRAINT "doctor_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_table" (
    "id" SERIAL NOT NULL,
    "rep_id" INTEGER NOT NULL,
    "remark" TEXT,
    "from_date" TEXT,
    "to_date" TEXT,
    "status" TEXT,
    "type" TEXT,
    "created_date" TIMESTAMP(3),
    "approved_by" INTEGER,
    "approved_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_report" (
    "id" SERIAL NOT NULL,
    "rep_id" INTEGER NOT NULL,
    "amount" TEXT,
    "remark" TEXT,
    "attachment" TEXT,
    "trip_date" TEXT,
    "doct_id" INTEGER,
    "approved_by" INTEGER,
    "approved_date" TIMESTAMP(3),
    "status" TEXT,
    "created_date" TIMESTAMP(3),

    CONSTRAINT "expense_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "add_chemist" (
    "id" SERIAL NOT NULL,
    "manager_id" INTEGER,
    "building_name" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "licence_number" TEXT,
    "address" JSONB,
    "date_of_birth" TEXT,
    "anniversary_date" TEXT,
    "date_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "add_chemist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "add_product" (
    "id" SERIAL NOT NULL,
    "manager_id" INTEGER,
    "product_name" JSONB,

    CONSTRAINT "add_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_details" (
    "id" SERIAL NOT NULL,
    "reporting_type" TEXT,
    "date" TEXT,
    "time" TEXT,
    "products" JSONB,
    "remarks" TEXT,
    "rep_id" INTEGER,
    "doctor_id" INTEGER,
    "datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reporting_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manager_details" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "dob" TEXT,
    "gender" TEXT,
    "mobile" TEXT,
    "qualification" TEXT,
    "designation" TEXT,
    "nationality" TEXT,
    "email" TEXT,
    "address" JSONB,
    "city" TEXT,
    "pincode" INTEGER,

    CONSTRAINT "manager_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor_details" ADD CONSTRAINT "doctor_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_address" ADD CONSTRAINT "doctor_address_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_table" ADD CONSTRAINT "leave_table_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_report" ADD CONSTRAINT "expense_report_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "rep_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
