import express from 'express';
import {loginUser } from '../Controller/UserAuth.controller.js';
import { authenticateToken, authorizeRole } from '../Middelware/Protector.js';

const router = express.Router();
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, async (req, res) => {
    // Return current user info
    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Admin only routes
router.get('/admin/users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
    // Only admins can access this
    res.json({ message: 'Admin access granted' });
});

export default router;