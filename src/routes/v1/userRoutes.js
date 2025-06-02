const express = require('express');
const { createUser , getAllUser , getUserById ,updateUser , deleteUser ,loginUser,assignGuardian, getGuardianbyStudent , getGuardianMapping} = require('../../controllers/userController');
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getAllUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

router.put('/students/:id/assign-guardian', assignGuardian);
router.post('/students/:id/assign-guardian', assignGuardian);
router.get('/students/:id/get-guardian', getGuardianbyStudent);
router.get('/guardian', getGuardianMapping);


module.exports = router;
