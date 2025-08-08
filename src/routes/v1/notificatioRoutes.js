// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');

// POST - Create a new notification
router.post('/alert', notificationController.createNotification);

// GET - Get notifications for the logged-in user
router.get('/alert', notificationController.getNotifications);

// PUT - Update an existing notification by ID
router.put('/alert/:id', notificationController.updateNotification);

// DELETE - Delete a notification by ID
router.delete('/alert/:id', notificationController.deleteNotification);

module.exports = router;
