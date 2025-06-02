const prisma = require('../../prisma/client');

/**
 * Create a new classroom with teacher and students
 * @param {Object} classroomData
 * @returns {Promise<Object>}
 */
const createClassroom = async (classroomData) => {
    const { className, teacherId, batchYear, studentIds } = classroomData;

    const newClassroom = await prisma.classroom.create({
        data: {
            name: className,
            teacherId,
            batchYear,
            students: {
                create: studentIds.map((studentId) => ({
                    student: { connect: { id: studentId } },
                })),
            },
        },
        include: {
            teacher: true,
            students: { include: { student: true } },
        },
    });

    return newClassroom;
};

/**
 * Get all classrooms with their teacher and students
 */
const getAllClassrooms = async () => {
    return await prisma.classroom.findMany({
        include: {
            teacher: true,
            students: {
                include: {
                    student: true,
                },
            },
        },
    });
};

module.exports = {
    createClassroom,
    getAllClassrooms,
};
