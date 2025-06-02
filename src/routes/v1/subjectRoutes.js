const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/subjectController');

router.post('/subject', subjectController.create);
router.get('/subject', subjectController.getAll);
router.get('/subject/:id', subjectController.getById);
router.put('/subject/:id', subjectController.update);
router.delete('/subject/:id', subjectController.remove);

module.exports = router;
