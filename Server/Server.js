import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./DataBase/DataBase.js";
import userRouter from "./Router/UserRegistration.Router.js";
import authRouter from "./Router/UserAuth.router.js";
import appointmentRouter from "./Router/Appointment.router.js";
import messageRouter from "./Router/Message.router.js";
import notificationRouter from "./Router/Notification.router.js";
import http from "http";
import cookieParser from "cookie-parser";
import initSocket from "./Lib/Socket.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// ✅ FIXED CORS CONFIG
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://batu-hospital-patient-appointment-system-158f.onrender.com",
            "https://batu-hospital-patient-appointment-system.onrender.com",
            "http://localhost:5173"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // ✅ Must call callback
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/message", messageRouter);
app.use("/api/notification", notificationRouter);
app.use("/api", userRouter);

// HTTP + SOCKET
const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io);

// ✅ FIXED RENDER PORT BINDING
server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server + sockets running on port ${PORT}`);
});
