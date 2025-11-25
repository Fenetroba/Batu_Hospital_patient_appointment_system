import express from 'express'
const router = express.Router()

import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  listConversations,
  updateMessage
} from '../Controller/Message.controller.js'

import { authenticateToken } from '../Middelware/Protector.js'

// Create/send a message
router.post('/', authenticateToken, sendMessage)

// List conversations for the authenticated user
router.get('/conversations', authenticateToken, listConversations)

// Get messages by conversationId (param) or by userA & userB as query params
router.get('/:conversationId', authenticateToken, getMessages)
router.get('/', authenticateToken, getMessages)

// Mark messages as read (body: { conversationId?, from? })
router.patch('/read', authenticateToken, markAsRead)

// Delete a message (soft delete for user)
router.delete('/:id', authenticateToken, deleteMessage)

// Update a message
router.put('/:id', authenticateToken, updateMessage)

export default router
