/*
  Warnings:

  - You are about to drop the column `guardianId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_guardianId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "guardianId";

-- CreateTable
CREATE TABLE "GuardianMapping" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuardianMapping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuardianMapping" ADD CONSTRAINT "GuardianMapping_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianMapping" ADD CONSTRAINT "GuardianMapping_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
