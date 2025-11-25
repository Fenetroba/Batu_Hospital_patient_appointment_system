import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import authReducer from "./UserAuthslicer";
import appointments from './Appointment.slice'
import messages from './messageSlice'
import notifications from './notificationSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        appointments: appointments,
        messages: messages,
        notifications: notifications
    }
})

export default store