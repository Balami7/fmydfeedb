-- AlterTable
ALTER TABLE "Service" ADD COLUMN "href" TEXT;
ALTER TABLE "Service" ADD COLUMN "external" BOOLEAN NOT NULL DEFAULT false;
