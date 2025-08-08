/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId,teacherId,examType,classroomId]` on the table `Mark` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Mark_studentId_subjectId_teacherId_key";

-- AlterTable
ALTER TABLE "public"."Mark" ADD COLUMN     "batchYear" INTEGER,
ADD COLUMN     "classroomId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Mark_studentId_subjectId_teacherId_examType_classroomId_key" ON "public"."Mark"("studentId", "subjectId", "teacherId", "examType", "classroomId");

-- AddForeignKey
ALTER TABLE "public"."Mark" ADD CONSTRAINT "Mark_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "public"."Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
