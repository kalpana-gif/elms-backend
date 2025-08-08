const notificationService = require('../services/notificationService');

// Create
const createNotification = async (req, res) => {
    try {
        const { title, message, targetRole, createdBy } = req.body;
        if (!title || !message || !targetRole || !createdBy) {
            return res.status(400).json({ error: 'Title, message, target role, and createdBy are required' });
        }
        const notification = await notificationService.createNotification({
            title: title.trim(),
            message: message.trim(),
            targetRole,
            createdById: createdBy,
        });
        res.status(201).json(notification);
    } catch (error) {
        res.status(error.message.includes('required') || error.message.includes('Invalid target role') ? 400 : 500)
            .json({ error: error.message });
    }
};

// Read
const getNotifications = async (req, res) => {
    try {
        const { role, id } = req.query;
        if (!role || !id) {
            return res.status(400).json({ error: 'role and id are required' });
        }
        const notifications = await notificationService.getNotifications(role, id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update
const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, targetRole, createdBy } = req.body;
        if (!id || !title || !message || !targetRole || !createdBy) {
            return res.status(400).json({ error: 'ID, title, message, target role, and createdBy are required' });
        }
        const notification = await notificationService.updateNotification(
            id,
            { title: title.trim(), message: message.trim(), targetRole },
            createdBy
        );
        res.status(200).json(notification);
    } catch (error) {
        res.status(error.message.includes('required') || error.message.includes('not authorized') ? 400 : 500)
            .json({ error: error.message });
    }
};

// Delete
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { createdBy } = req.query;
        if (!id || !createdBy) {
            return res.status(400).json({ error: 'Notification ID and createdBy are required' });
        }
        const result = await notificationService.deleteNotification(id, createdBy);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.message.includes('not authorized') ? 400 : 500)
            .json({ error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    updateNotification,
    deleteNotification,
};
