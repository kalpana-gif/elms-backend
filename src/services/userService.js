const prisma = require('../../prisma/client');

const saveUser = async (userData) => {
    const newUser = await prisma.user.create({
        data: userData,
    });
    return newUser;
};


const getAllUsers = async (role) => {

    const query = role
        ? {
            where: {
                role: {
                    equals: role,
                    mode: 'insensitive',
                },
            },
        }
        : {};

    return await prisma.user.findMany(query);
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


const allowedRoles = ['teacher', 'admin', 'parent'];

// const assignGuardianService = async (studentId, guardianId, batchYear) => {
//     console.log(`Assigning guardian ${guardianId} to student ${studentId} for batch ${batchYear}`);
//
//     const guardian = await prisma.user.findUnique({
//         where: { id: guardianId },
//     });
//
//     if (!guardian) {
//         throw new Error('Guardian user not found');
//     }
//
//     if (!allowedRoles.includes(guardian.role)) {
//         throw new Error(`Invalid guardian role: ${guardian.role}`);
//     }
//
//     const student = await prisma.user.findUnique({
//         where: { id: studentId },
//     });
//
//     if (!student) {
//         throw new Error('Student user not found');
//     }
//
//     const existing = await prisma.guardianMapping.findFirst({
//         where: {
//             studentId,
//             batchYear: parseInt(batchYear),
//         },
//     });
//
//     if (existing) {
//         console.log(`Updating existing mapping for student ${studentId} and batch ${batchYear}`);
//         return await prisma.guardianMapping.update({
//             where: { id: existing.id },
//             data: { guardianId },
//         });
//     }
//
//     console.log(`Creating new mapping for student ${studentId} and batch ${batchYear}`);
//     return await prisma.guardianMapping.create({
//         data: {
//             studentId,
//             guardianId,
//             batchYear: parseInt(batchYear),
//         },
//     });
// };

const assignGuardianService = async (studentId, guardianId, batchYear, subjectIds = []) => {
    console.log(`Assigning guardian ${guardianId} to student ${studentId} for batch ${batchYear} with subjects: ${subjectIds}`);

    const guardian = await prisma.user.findUnique({ where: { id: guardianId } });
    if (!guardian) throw new Error('Guardian user not found');
    if (!allowedRoles.includes(guardian.role)) throw new Error(`Invalid guardian role: ${guardian.role}`);

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student user not found');

    const existing = await prisma.guardianMapping.findFirst({
        where: { studentId },
    });

    if (existing) {
        await prisma.guardianMapping.update({
            where: { studentId },
            data: {
                guardianId,
                batchYear: parseInt(batchYear),
            },
        });
    } else {
        await prisma.guardianMapping.create({
            data: {
                studentId,
                guardianId,
                batchYear: parseInt(batchYear),
            },
        });
    }

    // Replace subjects
    await prisma.studentSubject.deleteMany({ where: { studentId } });

    if (subjectIds.length > 0) {
        const subjectEntries = subjectIds.map(subjectId => ({
            studentId,
            subjectId,
        }));
        await prisma.studentSubject.createMany({ data: subjectEntries });
    }

    return { message: 'Guardian and subjects assigned successfully' };
};



const getGuardianByStudentId = async (studentId) => {
    const mapping = await prisma.guardianMapping.findFirst({
        where: { studentId },
        include: {
            guardian: true,
        },
    });

    const subjectMappings = await prisma.studentSubject.findMany({
        where: { studentId },
        include: {
            subject: true,
        },
    });

    const subjects = subjectMappings.map((sm) => sm.subject);

    if (!mapping) {
        return {
            guardian: null,
            subjects: [],
            message: "No guardian assigned to this student.",
        };
    }

    return {
        guardian: mapping.guardian,
        batchYear: mapping.batchYear,
        subjects,
    };
};


const getAllGuardianMappings = async () => {
    const mappings = await prisma.guardianMapping.findMany({
        include: {
            student: true,
            guardian: true,
        },
    });

    // Fetch subjects for all students in parallel
    const subjectsByStudentId = await prisma.studentSubject.findMany({
        include: { subject: true },
    });

    // Group subjects by studentId
    const subjectMap = subjectsByStudentId.reduce((acc, entry) => {
        if (!acc[entry.studentId]) acc[entry.studentId] = [];
        acc[entry.studentId].push(entry.subject);
        return acc;
    }, {});

    // Combine guardian mapping with subjects
    const combined = mappings.map((mapping) => ({
        ...mapping,
        subjects: subjectMap[mapping.studentId] || [],
    }));

    return combined;
};



module.exports = {
    saveUser,
    getAllUsers,
    getUserByIdFromDB,
    deleteUserById,
    updateUserById,
    findUserByCredentials,
    assignGuardianService,
    getGuardianByStudentId,
    getAllGuardianMappings

};
