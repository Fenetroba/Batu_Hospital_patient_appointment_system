import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, Mail, MapPin, Filter, Search, CheckCircle, XCircle, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react'

const Appointment = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  // Mock appointment data - replace with actual API data
  const appointments = [
    {
      id: 1,
      patient: 'John Doe',
      age: 45,
      phone: '+251-912-345-678',
      email: 'john.doe@email.com',
      date: '2025-10-14',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'confirmed',
      reason: 'Regular checkup and blood pressure monitoring',
      department: 'General Medicine'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      age: 32,
      phone: '+251-923-456-789',
      email: 'jane.smith@email.com',
      date: '2025-10-14',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'confirmed',
      reason: 'Post-surgery follow-up examination',
      department: 'Surgery'
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      age: 28,
      phone: '+251-934-567-890',
      email: 'mike.j@email.com',
      date: '2025-10-14',
      time: '11:00 AM',
      type: 'Check-up',
      status: 'pending',
      reason: 'Annual health screening',
      department: 'General Medicine'
    },
    {
      id: 4,
      patient: 'Sarah Williams',
      age: 55,
      phone: '+251-945-678-901',
      email: 'sarah.w@email.com',
      date: '2025-10-14',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'confirmed',
      reason: 'Diabetes management consultation',
      department: 'Endocrinology'
    },
    {
      id: 5,
      patient: 'David Brown',
      age: 38,
      phone: '+251-956-789-012',
      email: 'david.b@email.com',
      date: '2025-10-15',
      time: '09:30 AM',
      type: 'Emergency',
      status: 'cancelled',
      reason: 'Severe headache and dizziness',
      department: 'Emergency'
    },
    {
      id: 6,
      patient: 'Emily Davis',
      age: 42,
      phone: '+251-967-890-123',
      email: 'emily.d@email.com',
      date: '2025-10-15',
      time: '11:00 AM',
      type: 'Consultation',
      status: 'completed',
      reason: 'Allergy consultation',
      department: 'Allergy & Immunology'
    }
  ]

  const tabs = [
    { id: 'all', label: 'All', count: appointments.length },
    { id: 'confirmed', label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length },
    { id: 'pending', label: 'Pending', count: appointments.filter(a => a.status === 'pending').length },
    { id: 'completed', label: 'Completed', count: appointments.filter(a => a.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesTab = selectedTab === 'all' || appointment.status === selectedTab
    const matchesSearch = appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !selectedDate || appointment.date === selectedDate
    return matchesTab && matchesSearch && matchesDate
  })

  const stats = [
    { label: 'Total Today', value: appointments.filter(a => a.date === '2025-10-14').length, color: 'bg-blue-500' },
    { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500' },
    { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-purple-500' }
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--six)] mb-2">Appointments</h1>
        <p className="text-gray-600">Manage and view all your appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name, reason, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--six)] focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--six)] focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--six)] text-white rounded-lg hover:opacity-90 transition-opacity">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedTab === tab.id
                  ? 'text-[var(--six)] border-b-2 border-[var(--six)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-[var(--six)] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-[var(--six)] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{appointment.patient}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{appointment.reason}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Age: {appointment.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {appointment.type}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 bg-[var(--six)] text-white rounded-lg hover:opacity-90 transition-opacity">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointment