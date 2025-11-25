import Message from '../Model/Message.model.js'
import mongoose from 'mongoose'

// Send/create a message
export const sendMessage = async (req, res) => {
	try {
		const sender = req.user?.id
		const { receiver, content, type, attachment, conversationId } = req.body

		if (!sender) return res.status(401).json({ message: 'Unauthorized' })

		// Basic validation
		if (!content && !attachment) {
			return res.status(400).json({ message: 'Message content or attachment required' })
		}

		const message = new Message({
			conversationId: conversationId || null,
			sender,
			receiver: receiver || null,
			content: content || '',
			type: type || 'text',
			attachment: attachment || undefined,
			status: 'sent',
			sentAt: new Date()
		})

		await message.save()

		const populatedMessage = await Message.findById(message._id)
			.populate('sender', 'fullName email profileImage')
			.populate('receiver', 'fullName email profileImage')

		const io = req.app.get('io')
		if (io) {
			if (receiver) {
				io.to(`user_${receiver}`).emit('new_message', populatedMessage)
			}
			if (conversationId) {
				io.to(conversationId).emit('new_message', populatedMessage)
			}
		}

		res.status(201).json({ success: true, message: 'Message sent', data: populatedMessage })
	} catch (error) {
		console.error('Error sending message:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

// Get messages for a conversation or between two users
export const getMessages = async (req, res) => {
	try {
		const { conversationId } = req.params
		const { userA, userB, limit = 100 } = req.query

		// If conversationId provided, use it
		if (conversationId) {
			const msgs = await Message.find({
				conversationId,
				$or: [
					{ sender: req.user?.id, isDeletedForSender: { $ne: true } },
					{ receiver: req.user?.id, isDeletedForReceiver: { $ne: true } },
					// If user is neither sender nor receiver (shouldn't happen in private chat but good for safety)
					// or if we just want to show non-deleted messages generally:
					// For simplicity in this app context where user is always sender or receiver:
				]
			})
				.sort({ createdAt: -1 })
				.limit(Number(limit))
				.populate('sender', 'fullName email profileImage')
				.populate('receiver', 'fullName email profileImage')

			return res.status(200).json({ success: true, count: msgs.length, data: msgs })
		}

		// If userA and userB provided, fetch direct messages between them
		if (userA && userB) {
			// validate ids
			if (!userA.match(/^[0-9a-fA-F]{24}$/) || !userB.match(/^[0-9a-fA-F]{24}$/)) {
				return res.status(400).json({ success: false, message: 'Invalid user id format' })
			}

			const msgs = await Message.find({
				$or: [
					{ sender: userA, receiver: userB, isDeletedForSender: { $ne: true } }, // if I am sender (userA), check isDeletedForSender
					{ sender: userB, receiver: userA, isDeletedForReceiver: { $ne: true } } // if I am receiver (userA), check isDeletedForReceiver
				]
			})
				.sort({ createdAt: -1 })
				.limit(Number(limit))
				.populate('sender', 'fullName email profileImage')
				.populate('receiver', 'fullName email profileImage')

			return res.status(200).json({ success: true, count: msgs.length, data: msgs })
		}

		return res.status(400).json({ success: false, message: 'conversationId or userA and userB required' })
	} catch (error) {
		console.error('Error fetching messages:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

// Mark messages as read for the current user in a conversation or from a specific sender
export const markAsRead = async (req, res) => {
	try {
		const userId = req.user?.id
		const { conversationId } = req.body
		const { from } = req.body // optional: mark messages from a specific sender

		if (!userId) return res.status(401).json({ message: 'Unauthorized' })

		const filter = { receiver: userId, status: { $ne: 'read' } }
		if (conversationId) filter.conversationId = conversationId
		if (from && mongoose.Types.ObjectId.isValid(from)) filter.sender = from

		const resUpdate = await Message.updateMany(filter, { status: 'read', readAt: new Date() })

		if (resUpdate.modifiedCount > 0) {
			const io = req.app.get('io')
			if (io) {
				const eventData = {
					conversationId,
					readerId: userId,
					readAt: new Date(),
					fromUser: from
				}

				// Emit to the conversation room if it exists
				if (conversationId) {
					io.to(conversationId).emit('messages_read', eventData)
				}

				// Also emit to the sender specifically so they know their messages were read
				if (from) {
					io.to(`user_${from}`).emit('messages_read', eventData)
				}
			}
		}

		res.status(200).json({ success: true, message: 'Messages marked read', modifiedCount: resUpdate.modifiedCount })
	} catch (error) {
		console.error('Error marking messages read:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

// Soft-delete a message for the current user; remove if both sides deleted
export const deleteMessage = async (req, res) => {
	try {
		const userId = req.user?.id
		const { id } = req.params

		if (!userId) return res.status(401).json({ message: 'Unauthorized' })
		if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid message id' })

		const message = await Message.findById(id)
		if (!message) return res.status(404).json({ message: 'Message not found' })

		const io = req.app.get('io')

		// If Sender: Delete for Everyone (Hard Delete)
		if (String(message.sender) === String(userId)) {
			await message.deleteOne()

			if (io) {
				// Notify sender
				io.to(`user_${userId}`).emit('message_deleted', id)
				// Notify receiver if they exist
				if (message.receiver) {
					io.to(`user_${message.receiver}`).emit('message_deleted', id)
				}
			}
			return res.status(200).json({ success: true, message: 'Message deleted for everyone' })
		}

		// If Receiver: Delete for Me (Soft Delete)
		if (String(message.receiver) === String(userId)) {
			if (message.isDeletedForReceiver) {
				return res.status(400).json({ message: 'Message already deleted' })
			}
			message.isDeletedForReceiver = true
			await message.save()

			if (io) {
				io.to(`user_${userId}`).emit('message_deleted', id)
			}
			return res.status(200).json({ success: true, message: 'Message deleted for you' })
		}

		return res.status(403).json({ message: 'Not authorized to delete this message' })
	} catch (error) {
		console.error('Error deleting message:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

// Update a message
export const updateMessage = async (req, res) => {
	try {
		const userId = req.user?.id
		const { id } = req.params
		const { content } = req.body

		if (!userId) return res.status(401).json({ message: 'Unauthorized' })
		if (!content) return res.status(400).json({ message: 'Content required' })

		const message = await Message.findById(id)
		if (!message) return res.status(404).json({ message: 'Message not found' })

		if (String(message.sender) !== String(userId)) {
			return res.status(403).json({ message: 'Not authorized to edit this message' })
		}

		message.content = content
		await message.save()

		const populatedMessage = await Message.findById(message._id)
			.populate('sender', 'fullName email profileImage')
			.populate('receiver', 'fullName email profileImage')

		const io = req.app.get('io')
		if (io) {
			if (message.receiver) {
				io.to(`user_${message.receiver}`).emit('message_updated', populatedMessage)
			}
			if (message.conversationId) {
				io.to(message.conversationId).emit('message_updated', populatedMessage)
			}
		}

		res.status(200).json({ success: true, message: 'Message updated', data: populatedMessage })
	} catch (error) {
		console.error('Error updating message:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

// Optionally: list recent conversations for a user with last message (simple implementation)
export const listConversations = async (req, res) => {
	try {
		const userId = req.user?.id
		if (!userId) return res.status(401).json({ message: 'Unauthorized' })

		// Aggregate to get distinct conversation ids or counterpart user ids
		const pipeline = [
			{ $match: { $or: [{ sender: mongoose.Types.ObjectId(userId) }, { receiver: mongoose.Types.ObjectId(userId) }] } },
			{ $sort: { createdAt: -1 } },
			{
				$group: {
					_id: { $ifNull: ['$conversationId', { $cond: [{ $eq: ['$sender', mongoose.Types.ObjectId(userId)] }, '$receiver', '$sender'] }] },
					lastMessage: { $first: '$$ROOT' }
				}
			},
			{ $replaceRoot: { newRoot: '$lastMessage' } },
			{ $limit: 50 }
		]

		const convs = await Message.aggregate(pipeline)

		res.status(200).json({ success: true, count: convs.length, data: convs })
	} catch (error) {
		console.error('Error listing conversations:', error)
		res.status(500).json({ success: false, message: 'Server error', error: error.message })
	}
}

