import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./DataBase/DataBase.js";
import userRouter from "./Router/UserRegistration.Router.js";
import authRouter from "./Router/UserAuth.router.js";
import appointmentRouter from "./Router/Appointment.router.js";
const PORT=process.env.PORT || 5000
import cookieParser from "cookie-parser";
connectDB();
const app = express();
// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            // Add other allowed origins here if needed
        ];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/appointment", appointmentRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
