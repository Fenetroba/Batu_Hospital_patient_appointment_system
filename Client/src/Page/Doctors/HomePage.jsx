import React from 'react'
import { Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

const HomePage = () => {
  // Mock data - replace with actual data from your backend
  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '12',
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Patients',
      value: '248',
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgLight: 'bg-yellow-50'
    },
    {
      title: 'Completed Today',
      value: '5',
      icon: CheckCircle,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgLight: 'bg-purple-50'
    }
  ]

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
    { id: 3, patient: 'Mike Johnson', time: '11:00 AM', type: 'Check-up', status: 'Pending' },
    { id: 4, patient: 'Sarah Williams', time: '02:00 PM', type: 'Consultation', status: 'Confirmed' },
  ]

  const recentActivities = [
    { id: 1, action: 'Completed consultation with John Doe', time: '30 mins ago' },
    { id: 2, action: 'Updated prescription for Jane Smith', time: '1 hour ago' },
    { id: 3, action: 'Reviewed lab results for Mike Johnson', time: '2 hours ago' },
    { id: 4, action: 'Scheduled follow-up with Sarah Williams', time: '3 hours ago' },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--six)] mb-2">Doctor's Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgLight} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--six)]">Upcoming Appointments</h2>
            <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--six)] rounded-full flex items-center justify-center text-white font-bold">
                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{appointment.patient}</h3>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{appointment.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[var(--six)] mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-[var(--six)] to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
            <Calendar className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">New Appointment</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">View Patients</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
            <AlertCircle className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Urgent Cases</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all">
            <TrendingUp className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage