import User from "../Model/UserRegistration.model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @description Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Please contact support."
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Create token payload
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        // Generate JWT token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'lax', // Changed from 'strict' to 'lax' for better cross-site compatibility
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined // Set your domain in production
        };

        // Set the cookie in the response
        res.cookie('token', token, cookieOptions);

        // Remove password from response
        const userResponse = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during logout",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




