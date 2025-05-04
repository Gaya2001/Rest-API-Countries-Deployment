// routes/userRoutes.js
import express from 'express';
import { verifyToken } from '../Middleware/authMiddleware.js';
import {
    getUserProfile,
    addFavoriteCountry,
    removeFavoriteCountry,
    getFavoriteCountries,
    updateUserProfile
} from '../Controllers/userController.js';

const router = express.Router();

// Apply the authentication middleware
router.use(verifyToken);

// Get user profile
router.get('/profile', getUserProfile);

// Add a country to favorites
router.post('/favorites', addFavoriteCountry);

// Remove a country from favorites
router.delete('/favorites/:countryCode', removeFavoriteCountry);

// Get all favorite countries
router.get('/getall/favorite', getFavoriteCountries);

// Update user profile
router.put('/profile', updateUserProfile);

// Export router using ES module syntax
export default router;
