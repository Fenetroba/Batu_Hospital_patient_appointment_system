import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import authReducer from "./UserAuthslicer";
import appointments from './Appointment.slice'

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        appointments:appointments
    }
})

export default store