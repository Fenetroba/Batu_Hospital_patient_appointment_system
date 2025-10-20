import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserAuthSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['Admin', 'Receptionist', 'Patient', 'Doctor', 'Nurse'],
        default: 'Patient',
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
UserAuthSchema.index({ email: 1 });
UserAuthSchema.index({ role: 1 });

// Hash password before saving


export default mongoose.model("UserAuth", UserAuthSchema);