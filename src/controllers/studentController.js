// src/controllers/studentController.js
const studentService = require('../services/studentService');

const getStudents = async (req, res) => {
    try {
        const { batchYear } = req.query;
        const students = batchYear
            ? await studentService.getStudentsByBatchYear(batchYear)
            : await studentService.getAllStudents();

        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch students.' });
    }
};

const getBatchYears = async (req, res) => {
    try {
        const years = await studentService.getDistinctBatchYears();
        res.json(years);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch batch years.' });
    }
};

module.exports = {
    getStudents,
    getBatchYears,
};
