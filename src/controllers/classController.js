const classService = require('../services/classService');

const createClassroom = async (req, res) => {
    try {
        const classroom = await classService.createClassroom(req.body);
        res.status(201).json(classroom);
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({ message: 'Failed to create classroom' });
    }
};

const getClassrooms = async (req, res) => {
    try {
        const classrooms = await classService.getAllClassrooms();
        res.status(200).json(classrooms);
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        res.status(500).json({ message: 'Failed to fetch classrooms' });
    }
};

module.exports = {
    createClassroom,
    getClassrooms,
};
