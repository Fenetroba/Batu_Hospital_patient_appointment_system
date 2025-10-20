import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Lib/Axios";

const initialState = {
    users: [],
    loading: false,
    error: null,
    currentUser: null // Add current user state
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload    
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(CreateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user);
            })
            .addCase(CreateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(UpdateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.user?._id) {
                    const updatedUser = action.payload.user;
                    state.users = state.users.map(user =>
                        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
                    );
                }
            })
            .addCase(UpdateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(DeleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeleteUser.fulfilled, (state, action) => {
                state.loading = false;
                // Handle both object and direct ID payloads for backward compatibility
                const deletedId = action.payload?.id || action.payload;
                state.users = state.users.filter(user => user._id !== deletedId);
            })
            .addCase(DeleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const CreateUser = createAsyncThunk("user/createUser", async (user) => {
    const response = await axiosInstance.post("/register", user);
    return response.data;
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
    const response = await axiosInstance.get("/");
    return response.data;
});

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/${userId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user";
      return rejectWithValue({ message });
    }
  }
);

// Update user status (isActive)
export const UpdateUser = createAsyncThunk(
  "user/updateUser", 
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/${id}/status`, 
        { isActive: userData.isActive }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update user status";
      return rejectWithValue({ message });
    }
  }
);

export const DeleteUser = createAsyncThunk(
  "user/deleteUser", 
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error("User ID is required for deletion");
      }
      
      const response = await axiosInstance.delete(`/${id}`);
      
      // If we have a success message in the response, treat it as success
      if (response.data.success || response.data.message) {
        return { id };
      }
      
      // If we get here, the response didn't have the expected format
      throw new Error("Unexpected response from server");
    } catch (error) {
      console.error('Delete user error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete user";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const { setUsers, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
