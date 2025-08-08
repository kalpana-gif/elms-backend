const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNotification = async ({ title, message, targetRole, createdById }) => {
   console.log("details->",title, message, targetRole, createdById)
    if (!title || !message || !targetRole || !createdById) {
        throw new Error('Title, message, target role, and createdById are required');
    }
    if (!['student', 'teacher', 'guardian', 'all'].includes(targetRole)) {
        throw new Error('Invalid target role');
    }

    try {
        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                targetRole,
                createdById,
            },
        });
        return notification;
    } catch (error) {
        throw new Error('Failed to create notification: ' + error.message);
    }
};

const getNotifications = async (userRole, userId) => {
    try {
        const where = userRole === 'admin'
            ? {}
            : {
                OR: [
                    { targetRole: userRole },
                    { targetRole: 'all' },
                ],
            };

        return await prisma.notification.findMany({
            where,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        throw new Error('Failed to fetch notifications: ' + error.message);
    }
};

const updateNotification = async (id, { title, message, targetRole }, userId) => {
    if (!id || !title || !message || !targetRole) {
        throw new Error('ID, title, message, and target role are required');
    }
    if (!['student', 'teacher', 'guardian', 'all'].includes(targetRole)) {
        throw new Error('Invalid target role');
    }

    try {
        const notification = await prisma.notification.findUnique({
            where: { id },
            select: { createdById: true },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }
        if (notification.createdById !== userId) {
            throw new Error('Not authorized to update this notification');
        }

        return await prisma.notification.update({
            where: { id },
            data: {
                title,
                message,
                targetRole,
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        throw new Error('Failed to update notification: ' + error.message);
    }
};

const deleteNotification = async (id, userId) => {
    try {
        const notification = await prisma.notification.findUnique({
            where: { id },
            select: { createdById: true },
        });

        if (!notification) {
            throw new Error('Notification not found');
        }
        if (notification.createdById !== userId) {
            throw new Error('Not authorized to delete this notification');
        }

        await prisma.notification.delete({ where: { id } });
        return { message: 'Notification deleted successfully' };
    } catch (error) {
        throw new Error('Failed to delete notification: ' + error.message);
    }
};

module.exports = {
    createNotification,
    getNotifications,
    updateNotification,
    deleteNotification,
};