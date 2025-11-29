import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '@/Stores/Appointment.slice';
import { Calendar, Clock, User, Building2, Loader2 } from 'lucide-react';

const MyAppointment = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(state => state.appointments);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Filter appointments for the current patient
  const myAppointments = useMemo(() => {
    if (!currentUser || !appointments || !Array.isArray(appointments)) {
      return [];
    }

    return appointments
      .filter(appointment => {
        // Match by patient ID (referencing the User _id)
        if (appointment.patient && typeof appointment.patient === 'object') {
          // When patient is populated as an object
          return appointment.patient._id === currentUser.id;
        }
        // If patient is just an ID string
        return appointment.patient === currentUser.id;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date, upcoming first
  }, [appointments, currentUser]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'scheduled':
      case 'pending':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--one)] p-4 md:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[var(--one)] p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>

        {myAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
            <p className="text-gray-500">You don't have any scheduled appointments at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left side - Main info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-gray-800">
                        {formatDate(appointment.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{appointment.timeSlot || 'Not specified'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">
                        Dr. {appointment.doctor?.fullName || 'Not assigned'}
                        {appointment.doctor?.speciality && (
                          <span className="text-gray-500 text-sm ml-2">
                            ({appointment.doctor.speciality})
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{appointment.department || 'General'}</span>
                    </div>
                  </div>

                  {/* Right side - Status */}
                  <div className="flex items-center">
                    <span
                      className={`${getStatusColor(
                        appointment.status
                      )} text-white px-4 py-2 rounded-full text-sm font-medium capitalize`}
                    >
                      {appointment.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Additional info if available */}
                {appointment.reason && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason: </span>
                      {appointment.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {myAppointments.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Total appointments: <span className="font-semibold">{myAppointments.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;