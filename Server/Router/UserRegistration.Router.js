import express from "express";
import { registerUser, getAllUsers, getUserById, updateUser, deleteUser } from "../Controller/UserRegistration.controller.js";
import { authenticateToken } from "../Middelware/Protector.js";

const router = express.Router();

// All user routes require authentication
// router.use(authenticateToken);

router.post("/register", registerUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
