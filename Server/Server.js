import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./DataBase/DataBase.js";
import userRouter from "./Router/UserRegistration.Router.js";
import authRouter from "./Router/UserAuth.router.js";
import appointmentRouter from "./Router/Appointment.router.js";
import messageRouter from "./Router/Message.router.js";
import notificationRouter from "./Router/Notification.router.js";
import http from 'http'
import cookieParser from "cookie-parser";
import initSocket from './Lib/Socket.js'

const PORT = process.env.PORT || 5000

connectDB();
const app = express();
// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://batu-hospital-patient-appointment-system-158f.onrender.com',
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

// Request logging middleware
app.use((req, res, next) => {

    next();
});

// Mount routes in order of specificity (most specific first)
app.use("/api/auth", authRouter);
app.use("/api/appointment", appointmentRouter);
// Mount message router (requires auth where applicable)
app.use('/api/message', messageRouter)
app.use('/api/notification', notificationRouter)
app.use("/api", userRouter);  // This should be last as it's the most general

// Create HTTP server and attach socket.io
const server = http.createServer(app)
const io = initSocket(server)
app.set('io', io)

server.listen(PORT, () => console.log(`Server + sockets running on port ${PORT}`));
