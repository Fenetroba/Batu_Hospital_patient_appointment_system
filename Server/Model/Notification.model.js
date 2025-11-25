import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'announcement', 'alert'],
        default: 'info'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegistration',
        required: true
    }
}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
