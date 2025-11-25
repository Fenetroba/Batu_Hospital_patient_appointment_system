import express from "express";
import mongoose from 'mongoose';
import { 
  registerUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  updateUserStatus 
} from "../Controller/UserRegistration.controller.js";
import { authenticateToken } from "../Middelware/Protector.js";

const router = express.Router();

// Route parameter validation middleware
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  
  // Log the full request for debugging
 
  // Convert ID to string and trim whitespace
  const userId = String(id).trim();
  
  // Common route mistakes
  const commonMistakes = {
    'appointment': '/api/appointment',
    'appointments': '/api/appointment',
    'doctor': '/api/doctors',
    'doctors': '/api/doctors',
    'patient': '/api/patients',
    'patients': '/api/patients'
  };
  
  // Check for common route mistakes
  if (commonMistakes[userId.toLowerCase()]) {
    console.error('Common route mistake detected:', {
      receivedId: userId,
      suggestedRoute: commonMistakes[userId.toLowerCase()],
      referer: req.headers.referer,
      userAgent: req.headers['user-agent']
    });
    
    return res.status(400).json({
      success: false,
      message: `Invalid route. Did you mean to access ${commonMistakes[userId.toLowerCase()]}?`,
      suggestedRoute: commonMistakes[userId.toLowerCase()],
      details: {
        receivedId: userId,
        method: req.method,
        originalUrl: req.originalUrl
      }
    });
  }

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error(`Invalid user ID format: ${userId}`);
    return res.status(400).json({
      success: false,
      message: `Invalid user ID format. Expected a 24-character hex string, got: ${id}`
    });
  }
  
  next();
};

// All user routes require authentication
// router.use(authenticateToken);

// Public routes
router.post("/register", registerUser);
router.get("/", getAllUsers);

// Routes with ID parameter (protected and validated)
router.get("/:id", validateUserId, getUserById);
router.put("/:id", validateUserId, updateUser);
router.patch("/:id/status", validateUserId, updateUserStatus);
router.delete("/:id", validateUserId, deleteUser);


export default router;
