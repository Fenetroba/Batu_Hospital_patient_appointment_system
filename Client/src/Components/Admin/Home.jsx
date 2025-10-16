import React from 'react'
import { Users, Calendar, FileText, Activity } from 'lucide-react'

const AdminHome = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Appointments', value: '567', icon: Calendar, color: 'bg-green-500' },
    { title: 'Reports', value: '89', icon: FileText, color: 'bg-purple-500' },
    { title: 'Active Now', value: '42', icon: Activity, color: 'bg-orange-500' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--six)]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">
          Manage your hospital appointment system from here. Use the sidebar to navigate between different sections.
        </p>
      </div>
    </div>
  )
}

export default AdminHome