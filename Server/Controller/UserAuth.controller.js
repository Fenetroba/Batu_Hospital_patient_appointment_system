import UserAuthSchema from "../Model/UserAuth.model.js";
import { authenticateToken, authorizeRole } from '../Middelware/Protector.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Enhanced login function
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({success:false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await UserAuthSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({success:false,
                message: "User not found"
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({success:false,
                message: "Account is deactivated"
            });
        }

        // Compare password using model's method
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({success:false,
                message: "Invalid password"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET ,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin
        };

        res.status(200).json({success:true,
            message: "Login successful",
            user: userResponse,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success:false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};

