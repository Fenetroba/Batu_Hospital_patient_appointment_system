import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAppointment } from '@/Stores/Appointment.slice';
import { toast } from 'sonner';

const CreateAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state.appointments?.loading);
  const { users } = useSelector(state => state.user);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorError, setDoctorError] = useState('');
  
  // Debug: Log the users from Redux
  useEffect(() => {
    console.log('Users from Redux:', users);
  }, [users]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    patient: location.state?.patientName || '',
    patientId: location.state?.patientId || '',
    date: new Date().toISOString().slice(0,10),
    time: '',
    department: 'General',
    doctor: '',
    status: 'Pending',
    age: location.state?.age || '',
    bloodType: location.state?.bloodType || 'A+',
    medicalDocument: '',
  });

 

  // Available departments
  const departments = [
    'General',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology'
  ];

  // Load doctors when component mounts or users change
  useEffect(() => {
    if (users && Array.isArray(users) && users.length > 0) {
      console.log('Filtering doctors from users:', users);
      const doctorList = users.filter(user => user.role === 'Doctor');
      console.log('Filtered doctors:', doctorList);
      setDoctors(doctorList);
      
      // Set the first doctor as default if none selected
      if (doctorList.length > 0 && !form.doctor) {
        setForm(prev => ({
          ...prev,
          doctor: doctorList[0]._id
        }));
      }
    }
  }, [users]);

  // Filter doctors by selected department
  const getDoctorsForDepartment = () => {
    if (!form.department) return [];
    
    const filtered = doctors.filter(doctor => {
      if (!doctor.department) return false;
      
      // Normalize department names for comparison
      const docDept = doctor.department.toString().trim().toLowerCase();
      const selectedDept = form.department.toString().trim().toLowerCase();
      
      console.log('Comparing doctor department:', {
        doctorName: doctor.fullName,
        doctorDept: doctor.department,
        formDept: form.department,
        match: docDept === selectedDept
      });
      
      return docDept === selectedDept;
    });
    
    console.log('Doctors for department', form.department, ':', filtered);
    console.log('All available doctors:', doctors);
    return filtered;
  };
  
  // Debug: Log the current state
  useEffect(() => {
    console.log('Current form state:', form);
    console.log('Available doctors:', doctors);
    console.log('Filtered doctors:', getDoctorsForDepartment());
  }, [form.department, doctors]);

  useEffect(() => {
    if (location.state) {
      setForm(prev => ({
        ...prev,
        patient: location.state.patientName || prev.patient,
        patientId: location.state.patientId || prev.patientId,
        age: location.state.age || prev.age,
        bloodType: location.state.bloodType || prev.bloodType
      }));
    }
  }, [location.state]);

  const onCancel = () => navigate('/nurses/appointments');
  const findDoctorById = (doctorId) => {
    return doctors.find(doctor => doctor._id === doctorId);
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.patient || !form.time || !form.doctor || !form.department) {
      const errorMsg = 'Please fill in all required fields';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      
      // Find the selected doctor
      const selectedDoctor = findDoctorById(form.doctor);
      
      if (!selectedDoctor) {
        throw new Error('Selected doctor not found');
      }

      // Prepare the appointment payload
      const payload = {
        PatientName: form.patient,
        patient: form.patientId,
        date: form.date,
        timeSlot: form.time,
        department: form.department,
        doctor: selectedDoctor._id, // Use the doctor's _id
        status: 'scheduled',
        reason: form.reason || ''
      };
      const action = await dispatch(createAppointment(payload));
      if (action.error) {
        throw new Error(action.payload || 'Failed to create appointment');
      }
      
      // Show success toast
      toast.success('Appointment created successfully!');
      
      // On successful submission, navigate back to appointments list
      navigate('/nurses/appointments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 p-8 bg-[var(--five)] rounded-lg shadow-md max-w-5xl mx-auto mt-2 ">
      <h3 className="text-4xl  font-bold text-gray-100 mb-6">New Appointment</h3>
      
      {/* Patient Information Section */}
      <div className="bg-[var(--five)] p-4 rounded-lg mb-6">
        <h4 className="text-lg font-semibold text-gray-100 mb-3">Patient Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
            <input 
              name="patient" 
              value={form.patient} 
              onChange={change} 
              className="w-full bg-[var(--five)] border border-gray-300 rounded px-3 py-2 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Patient ID</label>
            <input 
              name="patientId" 
              value={form.patientId} 
              onChange={change} 
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Age</label>
            <input 
              type="number"
              name="age" 
              value={form.age} 
              onChange={change} 
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Blood Type</label>
            <select 
              name="bloodType" 
              value={form.bloodType} 
              onChange={change}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="date" value={form.date} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none" />
          <input type="time" name="time" value={form.time} onChange={change} className="bg-black/30 rounded px-3 py-2 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select 
            name="department" 
            value={form.department} 
            onChange={(e) => {
              const newDept = e.target.value;
              const deptDoctors = doctors.filter(d => d.department === newDept);
              setForm(prev => ({
                ...prev,
                department: newDept,
                doctor: deptDoctors.length > 0 ? deptDoctors[0]._id : ''
              }));
            }} 
            className="bg-black/30 rounded px-3 py-2 outline-none text-white"
          >
            {departments.map(dept => (
              <option key={dept} value={dept} className="bg-[var(--five)]">
                {dept}
              </option>
            ))}
          </select>
          <select 
            name="doctor" 
            value={form.doctor} 
            onChange={change} 
            className="bg-black/30 rounded px-3 py-2 outline-none text-white"
            disabled={getDoctorsForDepartment().length === 0}
            required
          >
            <option value="">Select a doctor</option>
            {getDoctorsForDepartment().map(doctor => (
              <option key={doctor._id} value={doctor._id} className="bg-[var(--five)]">
                Dr. {doctor.fullName} {doctor.speciality ? `(${doctor.speciality})` : ''}
              </option>
            ))}
            {getDoctorsForDepartment().length === 0 && (
              <option value="" disabled>No doctors available in this department</option>
            )}
          </select>
        </div>
       
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Medical Document (Optional)</label>
          <input 
            type="text"
            name="medicalDocument" 
            value={form.medicalDocument} 
            onChange={change} 
            placeholder="Medical document ID/URL" 
            className="w-full bg-[var(--five)] border border-gray-300 rounded px-3 py-2 text-gray-100 outline-none"
          />
        </div>
      
      {submitError && <div className="text-red-400 text-sm">{submitError}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded bg-white/10">Cancel</button>
        <button type="submit" disabled={submitting || globalLoading} className="px-3 py-1 rounded bg-green-400 text-black disabled:opacity-60">{submitting || globalLoading ? 'Creating...' : 'Create'}</button>
      </div>
    </form>
  )
}

export default CreateAppointment