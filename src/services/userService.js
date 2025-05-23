const prisma = require('../../prisma/client');

const saveUser = async (userData) => {
    const newUser = await prisma.user.create({
        data: userData,
    });
    return newUser;
};

const getAllUsers = async () => {
    return await prisma.user.findMany();
};

const getUserByIdFromDB = async (id) => {
    return await prisma.user.findUnique({
        where: { id: id },
    });
};

const deleteUserById = async (id) => {
    try {
        return await prisma.user.delete({
            where: { id },
        });
    } catch (error) {
        if (error.code === 'P2025') return null; // Prisma not found
        throw error;
    }
};

const updateUserById = async (id, data) => {
    try {
        return await prisma.user.update({
            where: { id },
            data,
        });
    } catch (error) {
        if (error.code === 'P2025') return null; // Prisma not found
        throw error;
    }
};

const findUserByCredentials = async (email, password) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                password: password,
            },
        });

        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Internal server error');
    }
};

module.exports = { saveUser,getAllUsers,getUserByIdFromDB ,deleteUserById ,updateUserById ,findUserByCredentials };
