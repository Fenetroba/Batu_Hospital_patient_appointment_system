import React, { useEffect, useState } from 'react'
import { Bell, Plus, Edit, Trash2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification
} from '@/Stores/notificationSlice'

const NotificationManager = () => {
    const dispatch = useDispatch()
    const { notifications, loading, error } = useSelector((state) => state.notifications)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info'
    })

    useEffect(() => {
        dispatch(fetchNotifications())
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editingId) {
            await dispatch(updateNotification({ id: editingId, data: formData }))
        } else {
            await dispatch(createNotification(formData))
        }

        resetForm()
        dispatch(fetchNotifications())
    }

    const handleEdit = (notification) => {
        setFormData({
            title: notification.title,
            message: notification.message,
            type: notification.type
        })
        setEditingId(notification._id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            await dispatch(deleteNotification(id))
            dispatch(fetchNotifications())
        }
    }

    const resetForm = () => {
        setFormData({ title: '', message: '', type: 'info' })
        setEditingId(null)
        setShowForm(false)
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'alert':
                return 'bg-red-500/20 text-red-400 border-red-500/50'
            case 'announcement':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
            case 'info':
            default:
                return 'bg-green-500/20 text-green-400 border-green-500/50'
        }
    }

    return (
        <div className="p-6 bg-[var(--six)] rounded-xl min-h-[70vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-[var(--one)]" />
                    <h2 className="text-2xl font-bold text-white">Notification Management</h2>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--one)] text-black rounded-md hover:opacity-80"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'New Notification'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[var(--five)] rounded-lg p-5 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {editingId ? 'Edit Notification' : 'Create New Notification'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full bg-[var(--six)] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
                                placeholder="Enter notification title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={4}
                                className="w-full bg-[var(--six)] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
                                placeholder="Enter notification message"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-[var(--six)] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--one)]"
                            >
                                <option value="info">Info</option>
                                <option value="announcement">Announcement</option>
                                <option value="alert">Alert</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--one)] text-black rounded-md hover:opacity-80"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center text-gray-300 py-8">
                    Loading notifications...
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-400">Error: {error}</p>
                </div>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
                {!loading && notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className={`border rounded-lg p-4 ${getTypeColor(notification.type)}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-white">
                                        {notification.title}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                                        {notification.type}
                                    </span>
                                </div>
                                <p className="text-gray-300 mb-2">{notification.message}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span>
                                        Created: {new Date(notification.createdAt).toLocaleDateString()}
                                    </span>
                                    {notification.createdBy && (
                                        <span>
                                            By: {notification.createdBy.fullName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleEdit(notification)}
                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(notification._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!loading && notifications.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            No Notifications
                        </h3>
                        <p className="text-gray-500">
                            Create your first notification to get started.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationManager
