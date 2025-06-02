const express = require('express');
const router = express.Router();
const classController = require('../../controllers/classController');

router.post('/classroom', classController.createClassroom);         // /students
router.get('/classroom', classController.getClassrooms); // /students/batch-years

module.exports = router;