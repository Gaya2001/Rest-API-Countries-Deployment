// routes/profileRoutes.js
const express = require('express');
const { verifyToken } = require('../Middleware/authMiddleware');
const {
    getUserProfile,
    addFavoriteCountry,
    removeFavoriteCountry,
    getFavoriteCountries,
    updateUserProfile
} = require('../Controllers/userController');

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

router.put('/profile', updateUserProfile); // Update user profile);

module.exports = router;
