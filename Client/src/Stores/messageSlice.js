import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../Lib/Axios.js'
import { toast } from 'react-toastify'

const initialState = {
  conversations: [],
  messages: [],
  loading: false,
  error: null,
  currentConversationId: null
}

// Fetch recent conversations for the authenticated user
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/message/conversations')
      // server returns { success, count, data }
      return res.data.data || res.data
    } catch (error) {
      console.error('fetchConversations error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Fetch messages by conversationId
export const fetchMessagesByConversation = createAsyncThunk(
  'messages/fetchByConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/message/${conversationId}`)
      return res.data.data || res.data
    } catch (error) {
      console.error('fetchMessagesByConversation error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Fetch direct messages between two users
export const fetchMessagesBetweenUsers = createAsyncThunk(
  'messages/fetchBetweenUsers',
  async ({ userA, userB }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/message?userA=${userA}&userB=${userB}`)
      return res.data.data || res.data
    } catch (error) {
      console.error('fetchMessagesBetweenUsers error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Send a message
export const sendMessage = createAsyncThunk(
  'messages/send',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('/message', payload)
      // return created message
      return res.data.data || res.data
    } catch (error) {
      console.error('sendMessage error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Mark messages as read
export const markMessagesRead = createAsyncThunk(
  'messages/markAsRead',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.patch('/message/read', payload)
      return res.data
    } catch (error) {
      console.error('markMessagesRead error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Delete a message (soft-delete for user)
export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/message/${id}`)
      return id
    } catch (error) {
      console.error('deleteMessage error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Edit a message
export const editMessage = createAsyncThunk(
  'messages/edit',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/message/${id}`, { content })
      return res.data.data
    } catch (error) {
      console.error('editMessage error', error.response || error.message)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversationId = action.payload
    },
    addLocalMessage(state, action) {
      // optimistic add (e.g., socket message or immediately after send)
      state.messages = [...state.messages, action.payload]
    },
    updateLocalMessage(state, action) {
      const updatedMsg = action.payload
      state.messages = state.messages.map(m =>
        (m._id === updatedMsg._id || m.id === updatedMsg._id) ? updatedMsg : m
      )
    },
    clearMessages(state) {
      state.messages = []
    },
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // fetch conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false
      state.conversations = Array.isArray(action.payload) ? action.payload : []
    })
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error.message
      toast.error(state.error?.message || state.error || 'Failed to load conversations')
    })

    // fetch messages by conversation
    builder.addCase(fetchMessagesByConversation.pending, (state) => {
      state.loading = true
      state.error = null
      state.messages = []
    })
    builder.addCase(fetchMessagesByConversation.fulfilled, (state, action) => {
      state.loading = false
      state.messages = Array.isArray(action.payload) ? action.payload.reverse() : [] // server returns newest first
    })
    builder.addCase(fetchMessagesByConversation.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error.message
      toast.error(state.error?.message || state.error || 'Failed to load messages')
    })

    // fetch messages between users
    builder.addCase(fetchMessagesBetweenUsers.pending, (state) => {
      state.loading = true
      state.error = null
      state.messages = []
    })
    builder.addCase(fetchMessagesBetweenUsers.fulfilled, (state, action) => {
      state.loading = false
      state.messages = Array.isArray(action.payload) ? action.payload.reverse() : []
    })
    builder.addCase(fetchMessagesBetweenUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error.message
      toast.error(state.error?.message || state.error || 'Failed to load messages')
    })

    // send message
    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loading = false
      // server returns created message object
      const msg = action.payload?.data || action.payload || null
      if (msg) state.messages = [...state.messages, msg]
      toast.success('Message sent')
    })
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload || action.error.message
      toast.error(state.error?.message || state.error || 'Failed to send message')
    })

    // mark read
    builder.addCase(markMessagesRead.fulfilled, (state, action) => {
      // action.payload may contain modifiedCount; optimistic update messages to read
      state.messages = state.messages.map(m => ({ ...m, status: m.status === 'read' ? 'read' : 'read' }))
    })

    // delete
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      const id = action.payload
      // remove message locally by id
      state.messages = state.messages.filter(m => m._id !== id)
      toast.success('Message deleted')
    })
    builder.addCase(deleteMessage.rejected, (state, action) => {
      state.error = action.payload || action.error.message
      toast.error(state.error?.message || state.error || 'Failed to delete message')
    })

    // edit
    builder.addCase(editMessage.fulfilled, (state, action) => {
      const updatedMsg = action.payload
      state.messages = state.messages.map(m =>
        m._id === updatedMsg._id ? updatedMsg : m
      )
      toast.success('Message updated')
    })
  }
})

export const { setCurrentConversation, addLocalMessage, updateLocalMessage, clearMessages, clearError } = messageSlice.actions

export default messageSlice.reducer
