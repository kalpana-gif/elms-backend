const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStudents = async () => {
    try {
        return await prisma.user.findMany({
            where: { role: 'student' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch students: ' + error.message);
    }
};

const getBatchYears = async () => {
    try {
        const batchYears = await prisma.classroom.findMany({
            select: { batchYear: true },
            distinct: ['batchYear'],
        });
        return batchYears.map((b) => b.batchYear.toString()).sort();
    } catch (error) {
        throw new Error('Failed to fetch batch years: ' + error.message);
    }
};

const getClassrooms = async (teacherId) => {
    if (!teacherId) {
        throw new Error('Teacher ID is required');
    }
    try {
        return await prisma.classroom.findMany({
            where: { teacherId },
            select: {
                id: true,
                name: true,
                teacherId: true,
                batchYear: true,
                students: {
                    select: { studentId: true },
                },
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch classrooms: ' + error.message);
    }
};

const getStudentSubjects = async (teacherId) => {
    if (!teacherId) {
        throw new Error('Teacher ID is required');
    }
    try {
        return await prisma.studentSubject.findMany({
            where: {
                student: {
                    classesEnrolled: {
                        some: {
                            classroom: { teacherId },
                        },
                    },
                },
            },
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch student subjects: ' + error.message);
    }
};

const getExistingMarks = async (teacherId, subjectId, examType, classroomId) => {
    if (!teacherId || !subjectId || !examType || !classroomId) {
        throw new Error('Teacher ID, subject ID, exam type, and classroom ID are required');
    }
    try {
        return await prisma.mark.findMany({
            where: {
                teacherId,
                subjectId,
                examType,
                classroomId,
            },
            select: {
                studentId: true,
                subjectId: true,
                classroomId: true,
                batchYear: true,
                examType: true,
                marks: true,
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch existing marks: ' + error.message);
    }
};

const batchCreateMarks = async (markEntries) => {
    if (!Array.isArray(markEntries) || markEntries.length === 0) {
        throw new Error('Invalid input: Expected an array of mark entries');
    }

    const teacherId = markEntries[0].teacherId;
    const subjectIds = [...new Set(markEntries.map((entry) => entry.subjectId))];
    const studentIds = [...new Set(markEntries.map((entry) => entry.studentId))];
    const classroomIds = [...new Set(markEntries.map((entry) => entry.classroomId))];
    const examType = markEntries[0].examType;

    try {
        // Validate teacher authorization for the classroom
        const validClassrooms = await prisma.classroom.findMany({
            where: {
                id: { in: classroomIds },
                teacherId,
            },
            select: { id: true, batchYear: true },
        });

        const validClassroomIds = new Set(validClassrooms.map((c) => c.id));
        const invalidClassrooms = classroomIds.filter((id) => !validClassroomIds.has(id));
        if (invalidClassrooms.length > 0) {
            throw new Error('Teacher not authorized for some classrooms');
        }

        // Validate student-subject-classroom assignments
        const validAssignments = await prisma.studentSubject.findMany({
            where: {
                studentId: { in: studentIds },
                subjectId: { in: subjectIds },
                student: {
                    classesEnrolled: {
                        some: {
                            classroomId: { in: classroomIds },
                        },
                    },
                },
            },
            select: {
                studentId: true,
                subjectId: true,
                student: {
                    select: {
                        classesEnrolled: {
                            select: { classroomId: true },
                        },
                    },
                },
            },
        });

        const validStudentSubjectClassroomPairs = new Set(
            validAssignments.flatMap((a) =>
                a.student.classesEnrolled.map((ce) => `${a.studentId}-${a.subjectId}-${ce.classroomId}`)
            )
        );
        const invalidEntries = markEntries.filter(
            (entry) => !validStudentSubjectClassroomPairs.has(`${entry.studentId}-${entry.subjectId}-${entry.classroomId}`)
        );

        if (invalidEntries.length > 0) {
            throw new Error('Invalid student, subject, or classroom assignments');
        }

        // Validate batchYear matches classroom
        const classroomBatchYears = new Map(validClassrooms.map((c) => [c.id, c.batchYear]));
        const invalidBatchYears = markEntries.filter(
            (entry) => entry.batchYear !== classroomBatchYears.get(entry.classroomId)
        );
        if (invalidBatchYears.length > 0) {
            throw new Error('Batch year does not match classroom');
        }

        // Check for existing marks
        const existingMarks = await prisma.mark.findMany({
            where: {
                studentId: { in: studentIds },
                subjectId: { in: subjectIds },
                classroomId: { in: classroomIds },
                examType,
            },
            select: { studentId: true, subjectId: true, classroomId: true, examType: true },
        });

        const existingKeys = new Set(
            existingMarks.map((m) => `${m.studentId}-${m.subjectId}-${m.examType}-${m.classroomId}`)
        );
        const newMarks = markEntries.filter(
            (entry) => !existingKeys.has(`${entry.studentId}-${entry.subjectId}-${entry.examType}-${entry.classroomId}`)
        );

        if (newMarks.length === 0) {
            throw new Error('All marks already exist for these students, subjects, classrooms, and exam type');
        }

        // Create marks
        const result = await prisma.mark.createMany({
            data: newMarks.map((entry) => ({
                studentId: entry.studentId,
                subjectId: entry.subjectId,
                teacherId: entry.teacherId,
                classroomId: entry.classroomId,
                batchYear: entry.batchYear,
                examType: entry.examType,
                marks: parseFloat(entry.marks),
            })),
        });

        return { count: result.count };
    } catch (error) {
        throw new Error('Failed to create marks: ' + error.message);
    }
};

const batchUpdateMarks = async (markEntries) => {
    if (!Array.isArray(markEntries) || markEntries.length === 0) {
        throw new Error('Invalid input: Expected an array of mark entries');
    }

    const teacherId = markEntries[0].teacherId;
    const subjectIds = [...new Set(markEntries.map((entry) => entry.subjectId))];
    const studentIds = [...new Set(markEntries.map((entry) => entry.studentId))];
    const classroomIds = [...new Set(markEntries.map((entry) => entry.classroomId))];
    const examType = markEntries[0].examType;

    try {
        // Validate teacher authorization for the classroom
        const validClassrooms = await prisma.classroom.findMany({
            where: {
                id: { in: classroomIds },
                teacherId,
            },
            select: { id: true, batchYear: true },
        });

        const validClassroomIds = new Set(validClassrooms.map((c) => c.id));
        const invalidClassrooms = classroomIds.filter((id) => !validClassroomIds.has(id));
        if (invalidClassrooms.length > 0) {
            throw new Error('Teacher not authorized for some classrooms');
        }

        // Validate student-subject-classroom assignments
        const validAssignments = await prisma.studentSubject.findMany({
            where: {
                studentId: { in: studentIds },
                subjectId: { in: subjectIds },
                student: {
                    classesEnrolled: {
                        some: {
                            classroomId: { in: classroomIds },
                        },
                    },
                },
            },
            select: {
                studentId: true,
                subjectId: true,
                student: {
                    select: {
                        classesEnrolled: {
                            select: { classroomId: true },
                        },
                    },
                },
            },
        });

        const validStudentSubjectClassroomPairs = new Set(
            validAssignments.flatMap((a) =>
                a.student.classesEnrolled.map((ce) => `${a.studentId}-${a.subjectId}-${ce.classroomId}`)
            )
        );
        const invalidEntries = markEntries.filter(
            (entry) => !validStudentSubjectClassroomPairs.has(`${entry.studentId}-${entry.subjectId}-${entry.classroomId}`)
        );

        if (invalidEntries.length > 0) {
            throw new Error('Invalid student, subject, or classroom assignments');
        }

        // Validate batchYear matches classroom
        const classroomBatchYears = new Map(validClassrooms.map((c) => [c.id, c.batchYear]));
        const invalidBatchYears = markEntries.filter(
            (entry) => entry.batchYear !== classroomBatchYears.get(entry.classroomId)
        );
        if (invalidBatchYears.length > 0) {
            throw new Error('Batch year does not match classroom');
        }

        // Find existing marks to update
        const existingMarks = await prisma.mark.findMany({
            where: {
                studentId: { in: studentIds },
                subjectId: { in: subjectIds },
                classroomId: { in: classroomIds },
                examType,
            },
            select: { id: true, studentId: true, subjectId: true, classroomId: true, examType: true },
        });

        const existingKeys = new Set(
            existingMarks.map((m) => `${m.studentId}-${m.subjectId}-${m.examType}-${m.classroomId}`)
        );
        const updates = markEntries.filter((entry) =>
            existingKeys.has(`${entry.studentId}-${entry.subjectId}-${entry.examType}-${entry.classroomId}`)
        );

        if (updates.length === 0) {
            throw new Error('No existing marks found to update');
        }

        // Update marks
        const updatePromises = updates.map((entry) =>
            prisma.mark.updateMany({
                where: {
                    studentId: entry.studentId,
                    subjectId: entry.subjectId,
                    teacherId,
                    classroomId: entry.classroomId,
                    examType: entry.examType,
                },
                data: {
                    marks: parseFloat(entry.marks),
                    batchYear: entry.batchYear,
                    updatedAt: new Date(),
                },
            })
        );

        await Promise.all(updatePromises);
        return { count: updates.length };
    } catch (error) {
        throw new Error('Failed to update marks: ' + error.message);
    }
};

const getAllMarks = async () => {
    try {
        return await prisma.mark.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                teacher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                classroom: {
                    select: {
                        id: true,
                        name: true,
                        batchYear: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    } catch (error) {
        throw new Error('Failed to fetch all marks: ' + error.message);
    }
};


module.exports = {
    getStudents,
    getBatchYears,
    getClassrooms,
    getStudentSubjects,
    getExistingMarks,
    batchCreateMarks,
    batchUpdateMarks,
    getAllMarks
};