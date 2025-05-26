/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `GuardianMapping` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GuardianMapping_studentId_key" ON "GuardianMapping"("studentId");
