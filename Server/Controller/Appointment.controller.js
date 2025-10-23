import Appointment from '../Model/Appointment.model.js';
// Create a new appointment
export const createAppointment = async (req, res) => {
    try {
        // Validate request
        

        const {doctor, date, timeSlot,PatientName,department } = req.body;
         const PatientId=req.user.id;
        // Check if the slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctor,
            date,
            timeSlot,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        // Create new appointment
        const appointment = new Appointment({
            patient:PatientId,
            doctor,
            date,
            timeSlot,
            status: 'scheduled',
            PatientName,
            department
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment });

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');
        
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['scheduled', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ 
            message: 'Appointment status updated successfully', 
            appointment 
        });

    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get appointments by patient ID
export const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId })
            .populate('doctor', 'name specialization')
            .sort({ date: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get appointments by doctor ID
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId })
            .populate('patient', 'name email')
            .sort({ date: 1, timeSlot: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};