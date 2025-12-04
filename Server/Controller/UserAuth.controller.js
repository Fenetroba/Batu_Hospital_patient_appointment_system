import User from "../Model/UserRegistration.model.js";
import jwt from 'jsonwebtoken';
import "dotenv/config";
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
            role: user.role,
            fullName: user.fullName,
            profileImage: user.profileImage,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            age: user.age,
            isActive: user.isActive,
            bloodGroup: user.bloodGroup,
            speciality: user.speciality,
            doctorLicense: user.doctorLicense,
            experience: user.experience,
            nurseLicense: user.nurseLicense,
            shift: user.shift,
            department: user.department,
            workingHours: user.workingHours,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,


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
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'none',
            path: '/',

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
            lastLogin: user.lastLogin,
            profileImage: user.profileImage,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            age: user.age,
            bloodGroup: user.bloodGroup,
            speciality: user.speciality,
            doctorLicense: user.doctorLicense,
            experience: user.experience,
            nurseLicense: user.nurseLicense,
            shift: user.shift,
            department: user.department,
            workingHours: user.workingHours,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,

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

/**
 * @description Get all doctors or filter by department
 * @route GET /api/users/doctors
 * @access Private
 */
export const getDoctors = async (req, res) => {
    try {
        const { department } = req.query;

        // Build query
        const query = { role: 'Doctor', isActive: true };
        if (department) {
            query.department = department;
        }

        // Get doctors with selected fields
        const doctors = await User.find(query)
            .select('_id fullName email department speciality')
            .lean();

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
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




