import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../Lib/Axios.js';
import { toast } from 'react-toastify';




const initialState = {
  appointments: [],
  loading: false,
  error: null,
  currentAppointment: null
};

// Async Thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
   
      const response = await axios.get('/appointment');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, { rejectWithValue }) => {
    try {

      const response = await axios.post('/appointment', appointmentData);
      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete appointment');
    }
  }
);

// Slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Appointments
    builder.addCase(fetchAppointments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    });
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    });

    // Create Appointment

    builder.addCase(createAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments.push(action.payload);
      toast.success('Appointment created successfully');
    });
    builder.addCase(createAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    });

    // Update Appointment Status
    builder.addCase(updateAppointmentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAppointmentStatus.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.appointments.findIndex(apt => apt._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      toast.success('Appointment status updated');
    });
    builder.addCase(updateAppointmentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    });

    // Delete Appointment
    builder.addCase(deleteAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.appointments = state.appointments.filter(apt => apt._id !== action.payload);
      toast.success('Appointment deleted successfully');
    });
    builder.addCase(deleteAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    });
  },
});

// Export actions
export const { clearError, setCurrentAppointment } = appointmentSlice.actions;

// Export the reducer
export default appointmentSlice.reducer;