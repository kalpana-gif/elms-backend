const markEntryService = require('../../src/services/markService');

const getStudents = async (req, res) => {
    try {
        const students = await markEntryService.getStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBatchYears = async (req, res) => {
    try {
        const batchYears = await markEntryService.getBatchYears();
        res.status(200).json(batchYears);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClassrooms = async (req, res) => {
    try {
        const { teacherId } = req.query;
        if (!teacherId) {
            return res.status(400).json({ error: 'Teacher ID is required' });
        }
        const classrooms = await markEntryService.getClassrooms(teacherId);
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(error.message.includes('Teacher ID') ? 400 : 500).json({ error: error.message });
    }
};

const getStudentSubjects = async (req, res) => {
    try {
        const { teacherId } = req.query;
        if (!teacherId) {
            return res.status(400).json({ error: 'Teacher ID is required' });
        }
        const studentSubjects = await markEntryService.getStudentSubjects(teacherId);
        res.status(200).json(studentSubjects);
    } catch (error) {
        res.status(error.message.includes('Teacher ID') ? 400 : 500).json({ error: error.message });
    }
};

const getExistingMarks = async (req, res) => {
    try {
        const { teacherId, subjectId, examType, classroomId } = req.query;
        if (!teacherId || !subjectId || !examType || !classroomId) {
            return res.status(400).json({ error: 'Teacher ID, subject ID, exam type, and classroom ID are required' });
        }
        const marks = await markEntryService.getExistingMarks(teacherId, subjectId, examType, classroomId);
        res.status(200).json(marks);
    } catch (error) {
        res.status(error.message.includes('required') ? 400 : 500).json({ error: error.message });
    }
};

const batchCreateMarks = async (req, res) => {
    try {
        const markEntries = req.body;
        console.log(markEntries);
        const result = await markEntryService.batchCreateMarks(markEntries);
        res.status(201).json({ message: 'Marks created successfully', count: result.count });
    } catch (error) {
        const status = error.message.includes('Invalid input') ||
        error.message.includes('not authorized') ||
        error.message.includes('already exist') ||
        error.message.includes('Batch year does not match')
            ? 400
            : 500;
        res.status(status).json({ error: error.message });
    }
};

const batchUpdateMarks = async (req, res) => {
    try {
        const markEntries = req.body;
        const result = await markEntryService.batchUpdateMarks(markEntries);
        res.status(200).json({ message: 'Marks updated successfully', count: result.count });
    } catch (error) {
        const status = error.message.includes('Invalid input') ||
        error.message.includes('not authorized') ||
        error.message.includes('No existing marks') ||
        error.message.includes('Batch year does not match')
            ? 400
            : 500;
        res.status(status).json({ error: error.message });
    }
};
const getAllMarks = async (req, res) => {
    console.log("getAllMarks")
    try {
        const marks = await markEntryService.getAllMarks();
        res.status(200).json(marks);
    } catch (error) {
        res.status(500).json({ error: error.message });
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