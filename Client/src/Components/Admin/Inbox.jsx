import React from 'react'
import { Mail, Clock, User, CheckCircle } from 'lucide-react'

const Inbox = () => {
  const messages = [
    { id: 1, from: 'Dr. Smith', subject: 'Patient Report Review', time: '10 min ago', unread: true },
    { id: 2, from: 'Nurse Johnson', subject: 'Appointment Confirmation', time: '1 hour ago', unread: true },
    { id: 3, from: 'Admin Team', subject: 'System Update Notice', time: '3 hours ago', unread: false },
    { id: 4, from: 'Dr. Williams', subject: 'Schedule Change Request', time: 'Yesterday', unread: false }
  ]

  const stats = [
    { label: 'Total Messages', value: '24', icon: Mail, color: 'bg-blue-500' },
    { label: 'Unread', value: '8', icon: Clock, color: 'bg-orange-500' },
    { label: 'Read', value: '16', icon: CheckCircle, color: 'bg-green-500' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--six)]">Inbox</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Messages</h2>
        </div>
        <div className="divide-y">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className={`font-semibold ${message.unread ? 'text-blue-600' : 'text-gray-800'}`}>
                      {message.from}
                    </p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Inbox