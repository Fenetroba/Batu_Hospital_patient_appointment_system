import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Lib/Axios";

// Initial state for authentication
const initialState = {
  currentUser: null, // Stores logged-in user data
  token: null, // JWT token for API requests
  isLoading: false, // Loading state for async operations
  error: null, // Error messages
  isAuthenticated: false, // Boolean flag for auth status
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);

      // Return the full response data for success cases
      return response.data;
    } catch (error) {
      // Handle backend error responses
      if (error.response && error.response.data) {
        // Return the error message from backend
        return rejectWithValue(error.response.data);
      }
      // For network or other errors
      return rejectWithValue({
        success: false,
        message: "Network error. Please try again.",
      });
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const profile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue("Profile failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear auth state (for logout or error reset)
    clearAuth: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
    },

    // Set auth error
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Manual login (for testing or token refresh)
    setAuthData: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Registration cases
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Only update state on successful login
          state.currentUser = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        // Don't update auth state on error, just set error message
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(profile.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user; // Assuming your API returns { user: {...} }
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(profile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load profile";
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

// Export actions
export const { clearAuth, setAuthError, setAuthData } = authSlice.actions;
export default authSlice.reducer;
