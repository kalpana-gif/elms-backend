// src/controllers/userController.js
const { saveUser, getAllUsers, getUserByIdFromDB, deleteUserById, updateUserById , findUserByCredentials , assignGuardianService,  getGuardianByStudentId ,getAllGuardianMappings} = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const user = await saveUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

const getAllUser = async (req, res) => {
    const { role } = req.query;

    try {
        const users = await getAllUsers(role);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserByIdFromDB(userId); // Replace with your DB function

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};


const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await deleteUserById(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedUser = await updateUserById(userId, updatedData);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;


    try {
        const user = await findUserByCredentials(email, password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            uid: user.id,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

const assignGuardian = async (req, res) => {
    const { id: studentId } = req.params;
    const { guardianId, batchYear, subjectIds } = req.body;

    console.log(subjectIds)
    console.log(guardianId)
    console.log(batchYear)


    if (!guardianId) {
        return res.status(400).json({ error: 'Guardian ID is required' });
    }

    if (!batchYear) {
        return res.status(400).json({ error: 'batchYear is required' });
    }

    if (!subjectIds) {
        return res.status(400).json({ error: 'batchYear is required' });
    }

    try {
        const result = await assignGuardianService(studentId, guardianId, batchYear, subjectIds || []);
        console.log(`Guardian ${guardianId} assigned to Student ${studentId} for batch ${batchYear} with subjects: ${subjectIds}`);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in assignGuardian:", error.message);
        res.status(500).json({ error: 'Failed to assign guardian' });
    }
};




const getGuardianbyStudent = async (req, res) => {
    const studentId = req.params.id;

    try {
        const guardian = await getGuardianByStudentId(studentId);
        res.json(guardian);
    } catch (error) {
        console.error('Error fetching guardian:', error.message);
        res.status(404).json({ message: error.message });
    }
};

const getGuardianMapping = async (req, res) => {
    try {
        const mappings = await getAllGuardianMappings();
        res.status(200).json(mappings);
    } catch (error) {
        console.error('Error fetching guardian mappings:', error.message);
        res.status(500).json({ error: 'Failed to fetch guardian mappings' });
    }
};





module.exports = { createUser, getAllUser , getUserById , deleteUser, updateUser ,loginUser ,assignGuardian , getGuardianbyStudent , getGuardianMapping};
