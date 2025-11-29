import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../Stores/Appointment.slice';
import { fetchNotifications } from '@/Stores/notificationSlice';
import {
  Calendar,
  Clock,
  User,
  Clock3,
  CheckCircle,
  AlertCircle,
  Plus,
  Stethoscope,
  Activity,
  FileText,
  Bell
} from 'lucide-react';

const DoctorHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments = [], loading: appointmentsLoading } = useSelector((state) => state.appointments);
  const { notifications = [], loading: notifLoading } = useSelector((state) => state.notifications);
  const [stats, setStats] = useState({
    patientsToday: 0,
    upcomingAppointments: 0,
    pendingTasks: 0,
  });

  // Fetch appointments and notifications on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchAppointments()).unwrap();
        await dispatch(fetchNotifications()).unwrap();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  // Calculate statistics when appointments change
  useEffect(() => {
    if (appointments.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === today;
      });

      setStats({
        patientsToday: todayAppointments.length,
        upcomingAppointments: appointments.filter((apt) => apt.status === 'scheduled').length,
        pendingTasks: appointments.filter((apt) => apt.status === 'scheduled' || apt.status === 'pending').length,
      });
    }
  }, [appointments]);

  // Helper functions
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock3 className="w-4 h-4" /> },
      completed: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { bg: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> },
    };
    const info = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', icon: null };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.bg}`}>
        {info.icon && <span className="mr-1">{info.icon}</span>}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Patients Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.patientsToday}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-50 text-amber-600 mr-4">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4"><Bell className="inline-block mr-2" />Announcements</h2>
          {notifLoading && <p className="text-gray-500">Loading notifications...</p>}
          {!notifLoading && notifications.length === 0 && (
            <p className="text-gray-500">No announcements at the moment.</p>
          )}
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n._id} className={`border rounded-lg p-4 ${n.type === 'alert' ? 'bg-red-100/10 border-red-200' : n.type === 'announcement' ? 'bg-blue-100/10 border-blue-200' : 'bg-green-100/10 border-green-200'}`}>
                <h3 className="text-lg font-semibold text-gray-800">{n.title}</h3>
                <p className="text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

      

        {/* Recent Activity */}
        <div className="bg-[var(--six)] rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment._id} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-200">
                    <span className="font-medium">{appointment.PatientName || 'Patient'}</span> has an appointment at {formatTime(appointment.timeSlot)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;