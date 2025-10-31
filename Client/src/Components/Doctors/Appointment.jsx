import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, 
  Filter, Search, CheckCircle, XCircle, 
  AlertCircle, Eye, Edit, Trash2, ChevronDown, Check
} from 'lucide-react';
import { Fragment, useRef, useEffect } from 'react';
import { fetchAppointments, updateAppointmentStatus } from '../../Stores/Appointment.slice';
import { toast } from 'react-toastify';

const Appointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (appointmentId) => {
    setOpenDropdown(openDropdown === appointmentId ? null : appointmentId);
  };
  const { appointments = [], loading } = useSelector((state) => state.appointments);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const statusOptions = [
    { value: 'scheduled', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'completed', label: 'Confirmed', icon: CheckCircle, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' }
  ];

  // Fetch appointments on component mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await dispatch(fetchAppointments()).unwrap();
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [dispatch]);

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await dispatch(updateAppointmentStatus({
        id: appointmentId,
        status: newStatus
      })).unwrap();
      toast.success('Appointment status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update appointment status');
    }
  };

  // Process appointments data
  const processAppointments = appointments.map(apt => {
    {console.log(apt.PatientName,)}
    // Extract patient data (handles both nested and flat structures)
    const patientData = {
      name: apt.PatientName,   
    };

    // Extract creator (nurse) data
    const creatorData = {
      name: apt.createdBy?.name || apt.nurse?.name || 'N/A',
      role: apt.createdBy?.role || apt.nurse?.role || 'Nurse'
    };

    return {
      id: apt._id,
      patient: patientData.name,
      patientData,
      creator: creatorData.name,
      creatorRole: creatorData.role,
      phone: patientData.phone,
      email: patientData.email,
      date: apt.date ? new Date(apt.date).toISOString().split('T')[0] : 'N/A',
      time: apt.timeSlot || 'N/A',
      status: apt.status || 'pending',
      department: apt.department || 'General Medicine',
      _raw: apt  // Keep original data for reference
    };
  });

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All', count: processAppointments.length },
    
    { id: 'scheduled', label: 'Pending', count: processAppointments.filter(a => a.status === 'scheduled').length },
    { id: 'completed', label: 'Completed', count: processAppointments.filter(a => a.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: processAppointments.filter(a => a.status === 'cancelled').length }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
     
      case 'scheduled': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Filter appointments
  const filteredAppointments = processAppointments.filter(appointment => {
    const matchesTab = selectedTab === 'all' || appointment.status === selectedTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = appointment.patient?.toLowerCase().includes(searchLower) ||
                         appointment.reason?.toLowerCase().includes(searchLower) ||
                         appointment.department?.toLowerCase().includes(searchLower);
    const matchesDate = !selectedDate || appointment.date === selectedDate;
    return matchesTab && matchesSearch && matchesDate;
  });

  // Stats calculation
  const today = new Date().toISOString().split('T')[0];
  const stats = [
    { label: 'Total Today', value: processAppointments.filter(a => a.date === today).length, color: 'bg-blue-500' },
    { label: 'Confirmed', value: processAppointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-500' },
    { label: 'Pending', value: processAppointments.filter(a => a.status === 'scheduled').length, color: 'bg-yellow-500' },
    { label: 'Completed', value: processAppointments.filter(a => a.status === 'completed').length, color: 'bg-purple-500' }
  ];

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--six)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--six)] mb-2">Appointments</h1>
     
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
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

          {/* Clear Filters */}
          {(searchQuery || selectedDate) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedDate('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedTab === tab.id
                  ? 'text-[var(--six)] border-b-2 border-[var(--six)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
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
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Patient and Appointment Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Patient Avatar */}
                    <div className="w-14 h-14 bg-[var(--six)] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {appointment.patient 
                        ? appointment.patient.split(' ').map(n => n[0] || '').join('').toUpperCase() || '?'
                        : '?'}
                    </div>
                    
                    {/* Patient Details */}
                    <div className="flex-1">
                      {/* Patient Name and Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {appointment.patient}
                        
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Creator (Nurse) Info */}
                      {appointment.creator && appointment.creator !== 'N/A' && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1.5" />
                            Created by: {appointment.creator} 
                            {appointment.creatorRole && ` (${appointment.creatorRole})`}
                          </span>
                        </div>
                      )}
                      
                      {/* Appointment Reason */}
                      <p className="text-sm text-gray-600 mb-4">{appointment.reason}</p>
                      
                      {/* Appointment Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-500">
                       
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{appointment.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium w-fit">
                    {appointment.type}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="View Details"
                      onClick={() => navigate(`/doctor/appointments/view/${appointment._id}`)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <div className="relative inline-block text-left" ref={el => dropdownRefs.current[appointment.id] = el}>
                      <div>
                        <button 
                          type="button"
                          className="inline-flex items-center p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none"
                          title="Update Status"
                          onClick={() => toggleDropdown(appointment.id)}
                        >
                          <Edit className="w-5 h-5" />
                          <ChevronDown className={`w-4 h-4 ml-1 -mr-1 transition-transform ${openDropdown === appointment.id ? 'transform rotate-180' : ''}`} />
                        </button>
                      </div>
                      {openDropdown === appointment.id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-100 ease-in-out transform opacity-100 scale-100">
                          <div className="py-1">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  handleStatusUpdate(appointment.id, option.value);
                                  setOpenDropdown(null);
                                }}
                                className={`group flex w-full items-center px-4 py-2 text-sm ${
                                  appointment.status === option.value 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <option.icon 
                                  className={`mr-2 h-4 w-4 ${
                                    option.color === 'green' ? 'text-green-500' :
                                    option.color === 'red' ? 'text-red-500' : 'text-yellow-500'
                                  }`} 
                                  aria-hidden="true" 
                                />
                                <span className="flex-1 text-left">{option.label}</span>
                                {appointment.status === option.value && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointment;