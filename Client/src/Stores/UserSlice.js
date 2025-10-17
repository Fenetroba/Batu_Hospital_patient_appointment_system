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
                state.users = state.users.map(user =>
                    user.id === action.payload.user.id ? action.payload.user : user
                );
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
                state.users = state.users.filter(user => user.id !== action.payload.id);
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

export const UpdateUser = createAsyncThunk("user/updateUser", async ({ id, userData }) => {
    const response = await axiosInstance.put(`/${id}`, userData);
    return response.data;
});

export const DeleteUser = createAsyncThunk("user/deleteUser", async (id) => {
    await axiosInstance.delete(`/${id}`);
    return id; // Return the id to use in the reducer
});

export const { setUsers, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
