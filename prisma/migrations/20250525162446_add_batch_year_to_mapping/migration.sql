/*
  Warnings:

  - Added the required column `batchYear` to the `GuardianMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuardianMapping" ADD COLUMN     "batchYear" INTEGER NOT NULL;
