import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../Lib/Axios'

const API_URL = '/notification'

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                withCredentials: true
            })
            return response.data.data
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
        }
    }
)

// Create notification (Admin only)
export const createNotification = createAsyncThunk(
    'notifications/create',
    async (notificationData, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem('token')
            const response = await axios.post(API_URL, notificationData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create notification')
        }
    }
)

// Update notification
export const updateNotification = createAsyncThunk(
    'notifications/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.put(`${API_URL}/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update notification')
        }
    }
)

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
        }
    }
)

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false
                state.notifications = action.payload
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Create notification
            .addCase(createNotification.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload)
            })
            // Update notification
            .addCase(updateNotification.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id)
                if (index !== -1) {
                    state.notifications[index] = action.payload
                }
            })
            // Delete notification
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n._id !== action.payload)
            })
    }
})

export default notificationSlice.reducer
