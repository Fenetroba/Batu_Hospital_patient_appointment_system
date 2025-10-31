import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentById } from '../../../Stores/Appointment.slice';
import { toast } from 'react-toastify';
import { 
  User, Phone, Mail, Calendar, Clock, MapPin, 
  ArrowLeft, FileText, HeartPulse, ClipboardList
} from 'lucide-react';

const ViewAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const result = await dispatch(fetchAppointmentById(id)).unwrap();
        setAppointment(result);
      } catch (error) {
        console.error('Error loading appointment:', error);
        toast.error('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment not found</h3>
        <p className="text-gray-500 mb-4">The requested appointment could not be found or you don't have permission to view it.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { bg: 'bg-yellow-100 text-yellow-800', text: 'Scheduled' },
      completed: { bg: 'bg-green-100 text-green-800', text: 'Completed' },
      cancelled: { bg: 'bg-red-100 text-red-800', text: 'Cancelled' },
    };
    
    const statusInfo = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${statusInfo.bg}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        <div className="ml-auto">
          {appointment.status && getStatusBadge(appointment.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Patient Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{appointment.PatientName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                {appointment.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                {appointment.email || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Appointment Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">
                  {new Date(appointment.date).toLocaleDateString()} • {appointment.timeSlot}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{appointment.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-medium">{appointment.doctor || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Reason for Visit</p>
              <p className="text-gray-900">{appointment.reason || 'Not specified'}</p>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                <p className="text-gray-900 whitespace-pre-line">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Appointments
        </button>
      </div>
    </div>
  );
};

export default ViewAppointment;