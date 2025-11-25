
import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
	conversationId: {
		// optional id for group or direct conversation
		type: String,
		index: true,
		default: null
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserRegistration',
		required: true,
		index: true
	},
	receiver: {
		// for direct messages, receiver is a user id. For group messages, receiver may be null and conversationId used.
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserRegistration',
		default: null,
		index: true
	},
	content: {
		type: String,
		default: ''
	},
	type: {
		// message types: text, image, file, system
		type: String,
		enum: ['text', 'image', 'file', 'system'],
		default: 'text'
	},
	attachment: {
		// optional attachment URL or metadata (Cloudinary, etc.)
		url: { type: String, default: '' },
		filename: { type: String, default: '' },
		size: { type: Number, default: 0 }
	},
	status: {
		// message delivery/read status
		type: String,
		enum: ['sent', 'delivered', 'read'],
		default: 'sent'
	},
	isDeletedForSender: {
		type: Boolean,
		default: false
	},
	isDeletedForReceiver: {
		type: Boolean,
		default: false
	},
	sentAt: {
		type: Date,
		default: Date.now
	},
	deliveredAt: {
		type: Date,
		default: null
	},
	readAt: {
		type: Date,
		default: null
	}
}, { timestamps: true })

// Compound index to speed up conversation queries between two users
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })

// Convenience static: fetch recent messages for a conversation or between two users
MessageSchema.statics.fetchConversation = async function({ conversationId, userA, userB, limit = 50 }) {
	const query = {}
	if (conversationId) {
		query.conversationId = conversationId
	} else if (userA && userB) {
		query.$or = [
			{ sender: userA, receiver: userB },
			{ sender: userB, receiver: userA }
		]
	} else {
		throw new Error('conversationId or userA and userB required')
	}

	return this.find(query)
		.sort({ createdAt: -1 })
		.limit(limit)
		.lean()
}

const Message = mongoose.model('Message', MessageSchema)

export default Message

