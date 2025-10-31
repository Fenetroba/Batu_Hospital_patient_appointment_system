import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { fetchUsers } from '../../Stores/UserSlice';
import { deleteAppointment } from '../../Stores/Appointment.slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, X, Calendar, Plus } from 'lucide-react';
import FetchPatient from './AppointmentCRUD/FetchPatient';
import CreateAppointment from './AppointmentCRUD/CreateAppointment';
import FetchAppointment from './AppointmentCRUD/FetchAppointment';
import { fetchAppointments } from '@/Stores/Appointment.slice';

const Appointment = () => {
  const { appointments = [], loading: appointmentsLoading } = useSelector(state => state.appointments || {})
  console.log('Appointments from Redux:', appointments)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointment, setAppointment] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  // Check if we're in create mode from URL or state
  
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoadingAppointments(true);
        await dispatch(fetchAppointments()).unwrap();
      } catch (error) {
        console.error('Error loading appointments:', error);
        // Handle error (e.g., show error toast)
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadAppointments();
  }, [dispatch]);



  // Handle appointment creation success
  const handleAppointmentCreated = (newAppointment) => {
    // The Redux store will be updated by the createAppointment thunk
    setSelectedPatient(null);
    navigate('/nurses/appointments');
  };

  // Handle canceling appointment creation
  const handleCancelAppointment = () => {
    setSelectedPatient(null);
    navigate('/nurses/appointments');
  };

  // Handle editing an appointment
  const handleEditAppointment = (appointment) => {
    // Navigate to edit mode or open edit modal
    console.log('Edit appointment:', appointment);
    // Example: navigate(`/nurses/appointments/edit/${appointment._id}`);
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async (appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        // Dispatch delete action
        await dispatch(deleteAppointment(appointment._id)).unwrap();
        // The Redux store will be updated by the deleteAppointment thunk
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error(error.message || 'Failed to delete appointment');
      }
    }
  };
  
  // Memoized selector to get users
  const selectUsers = useMemo(
    () =>
      createSelector(
        [(state) => state.user],
        (userState) => {
          const allUsers = userState?.users || [];
          return {
            users: allUsers.filter(user => user.role === 'Patient'),
            loading: userState?.loading || false,
            error: userState?.error
          };
        }
      ),
    []
  );

  // Get filtered patients from Redux store
  const { users: patients, loading, error } = useSelector(selectUsers);
  

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle selecting a patient from the FetchPatient component
  const handleSelectPatient = (patient) => {
    navigate('/nurses/appointments/create', { 
      state: { 
        patientId: patient._id,
        patientName: patient.fullName || patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
      } 
    });
  };

  return (
    <div className="min-h-screen bg-[var(--one)] p-4">
      <div className="max-w-6xl mx-auto">
     

        {selectedPatient ? (
          <div className="bg-[var(--six)] rounded-xl p-6">
            <div className="mb-6 p-4 bg-[var(--five)] rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="text-white">{selectedPatient.name}</p>
                </div>
                {selectedPatient.gender && (
                  <div>
                    <p className="text-gray-400">Gender</p>
                    <p className="text-white capitalize">{selectedPatient.gender}</p>
                  </div>
                )}
                {selectedPatient.phone && (
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white">{selectedPatient.phone}</p>
                  </div>
                )}
                {selectedPatient.bloodGroup && (
                  <div>
                    <p className="text-gray-400">Blood Group</p>
                    <p className="text-white">{selectedPatient.bloodGroup}</p>
                  </div>
                )}
              </div>
            </div>
            
            <CreateAppointment 
              initial={{
                patient: selectedPatient.name,
                patientId: selectedPatient._id,
                // Add any other default values you want to pre-fill
              }}
              onSubmit={handleAppointmentCreated}
              onCancel={handleCancelAppointment}
            />
          </div>
        ) : (
          <div className="bg-[var(--six)] rounded-xl p-6 text-center">
            {loading ? (
              <div className="py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading patients...</p>
              </div>
            ) : error ? (
              <div className="py-12">
                <p className="text-red-400">Error loading patients: {error}</p>
                <button 
                  onClick={() => dispatch(fetchUsers())}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 mx-auto"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Appointments</h3>
                  <button 
                    onClick={() => setShowPatientPicker(true)}
                    disabled={patients.length === 0}
                    className={`px-4 py-2 ${patients.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg flex items-center gap-2`}
                  >
                    <Plus className="w-4 h-4" />
                    New Appointment
                  </button>
                </div>
                
                {appointmentsLoading ? (
                  <div className="py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400 text-center">Loading appointments...</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <User className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No patients found</h3>
                    <p className="text-gray-400 mb-6">Please add patients first to create appointments</p>
                  </div>
                ) : (
                  <FetchAppointment 
                    appointments={Array.isArray(appointments) ? appointments : []}
                    onEdit={handleEditAppointment}
                    onDelete={handleDeleteAppointment}
                    loading={appointmentsLoading}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Patient Picker Modal */}
        {showPatientPicker && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <FetchPatient 
                patients={patients}
                onSelect={handleSelectPatient}
                onClose={() => setShowPatientPicker(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;