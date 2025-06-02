// src/services/subjectService.js
const prisma = require('../../prisma/client');

const createSubject = async (data) => {
    return await prisma.subject.create({ data });
};

const getAllSubjects = async () => {
    return await prisma.subject.findMany();
};

const getSubjectById = async (id) => {
    return await prisma.subject.findUnique({ where: { id } });
};

const updateSubjectById = async (id, data) => {
    return await prisma.subject.update({
        where: { id },
        data,
    });
};

const deleteSubjectById = async (id) => {
    return await prisma.subject.delete({
        where: { id },
    });
};

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubjectById,
    deleteSubjectById,
};
