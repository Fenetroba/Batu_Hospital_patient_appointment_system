import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userRegistrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Patient', 'Doctor', 'Admin', 'Nurse', 'Receptionist'],
        default: 'Patient'
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    // Patient specific fields
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: ''
    },
    age: {
        type: Number,
        default: null
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        default: ''
    },
    // Doctor specific fields
    speciality: {
        type: String,
        default: ''
    },
    doctorLicense: {
        type: String,
        default: ''
    },
    experience: {
        type: Number,
        default: null
    },
    // Nurse specific fields
    nurseLicense: {
        type: String,
        default: ''
    },
    shift: {
        type: String,
        enum: ['Morning', 'Evening', 'Night', 'Rotating'],
        default: ''
    },
    // Receptionist specific fields
    department: {
        type: String,
        default: ''
    },
    workingHours: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Flexible'],
        default: ''
    }
}, {
    timestamps: true
});

// Hash password before saving
userRegistrationSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Simple static methods
userRegistrationSchema.statics.createUser = async function(userData) {
    const user = new this(userData);
    return await user.save();
};

userRegistrationSchema.statics.getUsers = async function() {
    return await this.find().sort({ createdAt: -1 });
};

userRegistrationSchema.statics.getUserById = async function(id) {
    return await this.findById(id);
};

userRegistrationSchema.statics.updateUser = async function(id, updates) {
    return await this.findByIdAndUpdate(id, updates, { new: true });
};

userRegistrationSchema.statics.deleteUser = async function(id) {
    return await this.findByIdAndDelete(id);
};

const UserRegistrationModel = mongoose.model('UserRegistration', userRegistrationSchema);

export default UserRegistrationModel;