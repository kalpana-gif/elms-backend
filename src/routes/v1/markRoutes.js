const express = require('express');
const router = express.Router();
const markEntryController = require('../../controllers/markController');

router.get('/students', markEntryController.getStudents);
router.get('/batch-years', markEntryController.getBatchYears);
router.get('/classrooms', markEntryController.getClassrooms);
router.get('/student-subjects', markEntryController.getStudentSubjects);
router.post('/marks/batch', markEntryController.batchCreateMarks);
router.put('/marks/batch', markEntryController.batchUpdateMarks);

module.exports = router;