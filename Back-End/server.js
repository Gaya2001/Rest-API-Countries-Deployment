import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './Routers/authRoutes.js';
import userRoutes from './Routers/userRoutes.js';
import path from 'path';

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Correct the directory spelling here
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/Front-End/dist')));




// Fallback route for React/Vue/SPA rendering - FIXED with named wildcard parameter
app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'Front-End', 'dist', 'index.html'));
});





mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
