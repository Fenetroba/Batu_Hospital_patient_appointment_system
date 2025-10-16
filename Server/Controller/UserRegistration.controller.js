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
      bloodGroup
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        message: "Required fields missing: fullName, email, password, and role are required"
      });
    }

    // Check if user already exists
    const existingUser = await UserRegistrationSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    // Hash password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const user = await UserRegistrationSchema.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      profileImage,
      speciality,
      address,
      phone,
      gender,
      age,
      bloodGroup
    });

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
    const users = await UserRegistrationSchema.find({});

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

    const user = await UserRegistrationSchema.findById(id);

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

    const user = await UserRegistrationSchema.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
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
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserRegistrationSchema.findByIdAndDelete(id);

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
