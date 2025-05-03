// controllers/profileController.js
const User = require('../Models/User');



// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Add a country to favorites
const addFavoriteCountry = async (req, res) => {
    try {
        const { countryCode, countryName, flagUrl } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if country already exists in favorites
        const existingCountry = user.favoriteCountries.find(
            country => country.countryCode === countryCode
        );

        if (existingCountry) {
            return res.status(400).json({
                success: false,
                message: 'Country already in favorites'
            });
        }

        // Add country to favorites
        user.favoriteCountries.push({ countryCode, countryName, flagUrl });
        await user.save();

        res.json({
            success: true,
            message: 'Country added to favorites',
            favoriteCountries: user.favoriteCountries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Remove a country from favorites
const removeFavoriteCountry = async (req, res) => {
    try {
        const { countryCode } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove country from favorites
        user.favoriteCountries = user.favoriteCountries.filter(
            country => country.countryCode !== countryCode
        );

        await user.save();

        res.json({
            success: true,
            message: 'Country removed from favorites',
            favoriteCountries: user.favoriteCountries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all favorite countries
const getFavoriteCountries = async (req, res) => {

    console.log('getFavoriteCountries called with req.id:', req.user.id); // Debugging line
    try {
        const user = await User.findById({ _id: req.user.id });

        console.log('User found:', user); // Debugging line

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }



        res.json({
            success: true,
            favoriteCountries: user.favoriteCountries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


const updateUserProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        console.log('updateUserProfile called with req.body:', req.body);

        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                username, username,
                email: email
            },
            { new: true }  // Return updated user
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};






module.exports = { getUserProfile, addFavoriteCountry, removeFavoriteCountry, getFavoriteCountries, updateUserProfile };
