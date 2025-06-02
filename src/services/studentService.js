
// src/services/studentService.js
const prisma = require('../../prisma/client');

// Fetch all students (role = student)
const getAllStudents = async () => {
    return await prisma.user.findMany({
        where: { role: 'student' },
    });
};

// Fetch students by batchYear
const getStudentsByBatchYear = async (batchYear) => {
    return await prisma.user.findMany({
        where: {
            role: 'student',
            studentMappings: {
                some: {
                    batchYear: parseInt(batchYear),
                },
            },
        },
        include: {
            studentMappings: true, // optional
        },
    });
};

// Get distinct batch years from GuardianMapping table
const getDistinctBatchYears = async () => {
    const batchYears = await prisma.guardianMapping.findMany({
        distinct: ['batchYear'],
        select: { batchYear: true },
        orderBy: { batchYear: 'desc' },
    });

    return batchYears.map(b => b.batchYear);
};

module.exports = {
    getAllStudents,
    getStudentsByBatchYear,
    getDistinctBatchYears,
};
