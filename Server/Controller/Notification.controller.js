import Notification from '../Model/Notification.model.js'

// Get all active notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ isActive: true })
            .populate('createdBy', 'fullName role')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: notifications
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Create notification (Admin only)
export const createNotification = async (req, res) => {
    try {
        const { title, message, type } = req.body
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        const notification = await Notification.create({
            title,
            message,
            type,
            createdBy: userId
        })

        res.status(201).json({
            success: true,
            data: notification
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update notification
export const updateNotification = async (req, res) => {
    try {
        const { id } = req.params
        const { title, message, type, isActive } = req.body

        const notification = await Notification.findByIdAndUpdate(
            id,
            { title, message, type, isActive },
            { new: true, runValidators: true }
        )

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            })
        }

        res.status(200).json({
            success: true,
            data: notification
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params

        const notification = await Notification.findByIdAndDelete(id)

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
