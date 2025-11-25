import React, { useEffect } from 'react'
import { Bell, Calendar, Info, AlertCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications } from '@/Stores/notificationSlice'

const Notification = () => {
  const dispatch = useDispatch()
  const { notifications, loading, error } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert':
        return AlertCircle
      case 'announcement':
        return Calendar
      case 'info':
      default:
        return Info
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'announcement':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      case 'info':
      default:
        return 'bg-green-500/10 border-green-500/30 text-green-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--one)] p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading notifications...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[var(--one)] p-6 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[var(--six)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-8 w-8 text-[var(--one)]" />
            <h1 className="text-3xl font-bold text-white">Notifications & Announcements</h1>
          </div>
          <p className="text-gray-300">
            Stay updated with the latest news and announcements from Batu Hospital.
          </p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getTypeIcon(notification.type)
            return (
              <div
                key={notification._id}
                className={`bg-[var(--six)] rounded-xl p-5 border-l-4 ${getTypeColor(notification.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${getTypeColor(notification.type)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.createdBy && (
                      <div className="mt-2 text-xs text-gray-400">
                        Posted by: {notification.createdBy.fullName} ({notification.createdBy.role})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {notifications.length === 0 && !loading && (
          <div className="bg-[var(--six)] rounded-xl p-12 text-center">
            <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Notifications
            </h3>
            <p className="text-gray-500">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification