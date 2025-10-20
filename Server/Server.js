import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import connectDB from "./DataBase/DataBase.js";
import userRouter from "./Router/UserRegistration.Router.js";
import authRouter from "./Router/UserAuth.router.js";
const PORT=process.env.PORT || 5000
import cookieParser from "cookie-parser";
connectDB();
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/api/auth", authRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
