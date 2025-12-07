import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Message from '../Model/Message.model.js'

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').map(c => c.trim()).reduce((acc, pair) => {
    const idx = pair.indexOf('=')
    if (idx === -1) return acc
    const key = pair.slice(0, idx)
    const val = pair.slice(idx + 1)
    acc[key] = decodeURIComponent(val)
    return acc
  }, {})
}

export default function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        'https://batu-hospital-patient-appointment-system-158f.onrender.com'
      ],
      credentials: true
    }
  })

  io.use((socket, next) => {
    try {
      // Support token in handshake.auth.token (recommended for socket clients)
      const token = socket.handshake.auth?.token || (() => {
        // Or try cookie 'token'
        const cookieHeader = socket.handshake.headers.cookie || ''
        const cookies = parseCookies(cookieHeader)
        return cookies.token
      })()

      if (!token) return next(new Error('Authentication error: token missing'))

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Authentication error: invalid token'))
        socket.user = user
        next()
      })
    } catch (err) {
      next(err)
    }
  })

  io.on('connection', (socket) => {
    const user = socket.user
    if (user && user.id) {
      // join a personal room for direct delivery
      socket.join(`user_${user.id}`)
    }

    socket.on('join_conversation', (conversationId) => {
      if (conversationId) socket.join(conversationId)
    })

    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) socket.leave(conversationId)
    })

    socket.on('send_message', async (payload, ack) => {
      try {
        const senderId = socket.user?.id
        if (!senderId) throw new Error('Unauthorized')

        const { receiver, content, type = 'text', attachment = null, conversationId = null } = payload || {}

        if (!content && !attachment) throw new Error('Message content or attachment required')

        const msg = new Message({
          conversationId: conversationId || null,
          sender: senderId,
          receiver: receiver || null,
          content: content || '',
          type,
          attachment: attachment || undefined,
          status: 'sent',
          sentAt: new Date()
        })

        await msg.save()

        // populate sender/receiver minimally
        const populated = await Message.findById(msg._id).populate('sender', 'fullName profileImage').populate('receiver', 'fullName profileImage')

        // Emit to conversation room (if provided)
        if (conversationId) io.to(conversationId).emit('new_message', populated)

        // Emit to receiver personal room
        if (receiver) io.to(`user_${receiver}`).emit('new_message', populated)

        // Ack to sender
        if (typeof ack === 'function') ack({ success: true, data: populated })
      } catch (err) {
        console.error('send_message error', err)
        if (typeof ack === 'function') ack({ success: false, message: err.message })
      }
    })

    socket.on('mark_read', async (payload, ack) => {
      try {
        const userId = socket.user?.id
        if (!userId) throw new Error('Unauthorized')

        const { conversationId, from } = payload || {}
        const filter = { receiver: userId, status: { $ne: 'read' } }
        if (conversationId) filter.conversationId = conversationId
        if (from) filter.sender = from

        const resUpdate = await Message.updateMany(filter, { status: 'read', readAt: new Date() })

        // notify counterpart(s)
        if (from) io.to(`user_${from}`).emit('messages_read', { by: userId, conversationId })

        if (typeof ack === 'function') ack({ success: true, modifiedCount: resUpdate.modifiedCount })
      } catch (err) {
        console.error('mark_read error', err)
        if (typeof ack === 'function') ack({ success: false, message: err.message })
      }
    })

    socket.on('disconnect', (reason) => {

    })
  })

  return io
}
