import express from 'express';
import {loginUser, logoutUser } from '../Controller/UserAuth.controller.js';
import { authenticateToken, authorizeRole } from '../Middelware/Protector.js';

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

// Admin only routes
router.get('/admin/users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
    // Only admins can access this
    res.json({ message: 'Admin access granted' });
});

export default router;