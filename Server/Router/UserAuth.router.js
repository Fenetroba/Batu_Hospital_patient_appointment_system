import express from 'express';
import { loginUser, logoutUser, getDoctors } from '../Controller/UserAuth.controller.js';
import { authenticateToken, authorizeRole } from '../Middelware/Protector.js';
import { ChangePassword } from '../Controller/UserRegistration.controller.js';

const router = express.Router();
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Return current user info
        res.json({
            success: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                isActive: req.user.isActive,
                lastLogin: req.user.lastLogin,
                fullName: req.user.fullName,
                profileImage: req.user.profileImage,
                phone: req.user.phone,
                address: req.user.address,
                gender: req.user.gender,
                age: req.user.age,
                bloodGroup: req.user.bloodGroup,
                speciality: req.user.speciality,
                doctorLicense: req.user.doctorLicense,
                experience: req.user.experience,
                nurseLicense: req.user.nurseLicense,
                shift: req.user.shift,
                department: req.user.department,
                workingHours: req.user.workingHours,
                createdAt: req.user.createdAt,
                updatedAt: req.user.updatedAt,
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.patch('/change-password/:userId', authenticateToken, ChangePassword);
// Admin only routes
// Get all doctors or filter by department
router.get('/users/doctors', authenticateToken, getDoctors);

// Admin only routes
router.get('/admin/users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
    // Only admins can access this
    res.json({ message: 'Admin access granted' });
});

export default router;