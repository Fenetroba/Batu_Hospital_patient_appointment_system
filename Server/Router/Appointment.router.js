import express from 'express';
const router = express.Router();
import { createAppointment, deleteAppointment, getAllAppointments, getAppointmentById, getDoctorAppointments, getPatientAppointments, updateAppointmentStatus, uploadPatientInfo } from '../Controller/Appointment.controller.js';
import { authenticateToken } from '../Middelware/Protector.js';

// Public routes (no auth for demo - add auth middleware in production)
router.post('/', authenticateToken, createAppointment);
router.get('/', authenticateToken, getAllAppointments);
router.get('/:id', authenticateToken, getAppointmentById);
router.patch('/:id/status', authenticateToken, updateAppointmentStatus);
router.delete('/:id', authenticateToken, deleteAppointment);
router.get('/patient/:patientId', authenticateToken, getPatientAppointments);
router.get('/doctor/:doctorId', authenticateToken, getDoctorAppointments);
router.post('/:id/patient-info', authenticateToken, uploadPatientInfo);

export default router;