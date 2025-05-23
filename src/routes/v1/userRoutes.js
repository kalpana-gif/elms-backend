const express = require('express');
const { createUser , getAllUser , getUserById ,updateUser , deleteUser ,loginUser } = require('../../controllers/userController');
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getAllUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;
