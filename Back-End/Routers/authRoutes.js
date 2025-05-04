// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, logoutUser } from '../Controllers/authController.js';  // Use import here
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', logoutUser);

export default router;
