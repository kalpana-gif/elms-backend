// src/controllers/subjectController.js
const {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubjectById,
    deleteSubjectById,
} = require('../services/subjectService');

const create = async (req, res) => {
    try {
        const subject = await createSubject(req.body);
        res.status(201).json(subject);
    } catch (error) {
        console.error('Error creating subject:', error.message);
        res.status(500).json({ error: 'Failed to create subject' });
    }
};

const getAll = async (req, res) => {
    try {
        const subjects = await getAllSubjects();
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Error getting subjects:', error.message);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
};

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await getSubjectById(id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error getting subject:', error.message);
        res.status(500).json({ error: 'Failed to get subject' });
    }
};

const update = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await updateSubjectById(id, req.body);
        res.status(200).json(subject);
    } catch (error) {
        console.error('Error updating subject:', error.message);
        res.status(500).json({ error: 'Failed to update subject' });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteSubjectById(id);
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error.message);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
};
