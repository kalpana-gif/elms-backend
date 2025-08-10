const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createExam(data) {
    return prisma.exam.create({
        data: {
            title: data.title,
            classroomId: data.classroomId,
            date: data.date,
            description: data.description,
            fileData: data.fileBuffer,
            fileName: data.fileName,
            fileType: data.fileType,
        },
    });
}

async function getAllExams() {
    return prisma.exam.findMany();
}

async function getExamById(id) {
    return prisma.exam.findUnique({ where: { id } });
}

async function updateExam(id, data) {
    return prisma.exam.update({
        where: { id },
        data: {
            title: data.title,
            classroomId: data.classroomId,
            date: data.date,
            description: data.description,
            fileData: data.fileBuffer,
            fileName: data.fileName,
            fileType: data.fileType,
        },
    });
}

async function deleteExam(id) {
    return prisma.exam.delete({ where: { id } });
}

module.exports = {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
};
