import express from 'express'
import {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification
} from '../Controller/Notification.controller.js'
import { authenticateToken } from '../Middelware/Protector.js'

const router = express.Router()

// Public route - anyone can view notifications
router.get('/', getNotifications)

// Protected routes - require authentication
router.post('/', authenticateToken, createNotification)
router.put('/:id', authenticateToken, updateNotification)
router.delete('/:id', authenticateToken, deleteNotification)

export default router
