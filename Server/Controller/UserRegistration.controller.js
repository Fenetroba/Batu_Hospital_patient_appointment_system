import UserRegistrationSchema from "../Model/UserRegistration.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      profileImage,
      speciality,
      address,
      phone,
      gender,
      age,
      bloodGroup,
      // Doctor specific fields
      doctorLicense,
      experience,
      // Nurse specific fields
      nurseLicense,
      shift,
      // Receptionist specific fields
      department,
      workingHours
    } = req.body;

    // Role-based authorization check
    // For now, we'll assume the current user role is passed in the request
    // In a real app, you'd get this from JWT token or session
    const currentUserRole = req.user?.role || 'Admin'; // Default to Admin for testing

    // Check if current user is authorized to create the requested role
    if (currentUserRole === 'Receptionist' && role !== 'Patient') {
      return res.status(403).json({
        message: "Receptionists can only create Patient users"
      });
    }

    if (currentUserRole === 'Admin' && role === 'Patient') {
      return res.status(403).json({
        message: "Admins cannot create Patient users. Only Receptionists can create Patients."
      });
    }

    // Role-specific validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "Basic fields missing: fullName, email, password, and role are required"
      });
    }

    // Validate role-specific fields
    if (role === 'Patient' && (!address || !phone)) {
      return res.status(400).json({
        message: "Patient fields missing: address and phone are required"
      });
    }

    if (role === 'Doctor' && (!speciality || !doctorLicense || !experience || !address || !phone)) {
      return res.status(400).json({
        message: "Doctor fields missing: speciality, doctorLicense, experience, address, and phone are required"
      });
    }

    if (role === 'Nurse' && (!nurseLicense || !shift || !address || !phone)) {
      return res.status(400).json({
        message: "Nurse fields missing: nurseLicense, shift, address, and phone are required"
      });
    }

    if (role === 'Receptionist' && (!department || !workingHours || !address || !phone)) {
      return res.status(400).json({
        message: "Receptionist fields missing: department, workingHours, address, and phone are required"
      });
    }

    // Check if user already exists
    const existingUser = await UserRegistrationSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    // Convert empty strings to null for optional fields
    const sanitizedData = {
      fullName,
      email,
      password, // Will be hashed by the pre-save hook
      role,
      profileImage: profileImage || null,
      speciality: speciality || null,
      address,
      phone,
      gender: gender || null,
      age: age ? Number(age) : null,
      bloodGroup: bloodGroup || null,
      // Role-specific fields
      doctorLicense: doctorLicense || null,
      experience: experience ? Number(experience) : null,
      nurseLicense: nurseLicense || null,
      shift: shift || null,
      department: department || null,
      workingHours: workingHours || null
    };

    // Create user with sanitized data
    const user = await UserRegistrationSchema.createUser(sanitizedData);

    // Remove password from response for security
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      speciality: user.speciality,
      address: user.address,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      bloodGroup: user.bloodGroup,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
// Get all users (Read)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserRegistrationSchema.getUsers();

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// Get user by ID (Read)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserRegistrationSchema.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// Update user (Update)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates if present (password should be updated separately)
    delete updates.password;

    const user = await UserRegistrationSchema.updateUser(
      id,
      { ...updates, updatedAt: new Date() }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// Delete user (Delete)
// Update user status (Active/Inactive)
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await UserRegistrationSchema.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserRegistrationSchema.deleteUser(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Delete user error:", error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
