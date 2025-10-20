import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import authReducer from "./UserAuthslicer";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer
    }
})

export default store