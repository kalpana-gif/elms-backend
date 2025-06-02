// src/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/studentController');

router.get('/get-students', studentController.getStudents);         // /students
router.get('/batch-years', studentController.getBatchYears); // /students/batch-years

module.exports = router;
