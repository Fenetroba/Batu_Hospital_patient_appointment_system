import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  PatientName: {
    type: String,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRegistration',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRegistration',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  department: {
    type: String,
    // enum:["General","Cardiology","Neurology","Pediatrics","Orthopedics","Dermatology"]
    required: true
  },
  patientInfoFile: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Prevent double booking
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;