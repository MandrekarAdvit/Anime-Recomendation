import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Models
import Anime from './models/Anime.js';
import User from './models/User.js'; 

// 1. Load Environment Variables
const envFile = './mong.env';
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`📂 Found and loaded: ${envFile}`);
} else {
    console.error(`❌ Error: Could not find ${envFile}!`);
}

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('🛑 MONGO_URI is undefined! Check mong.env');
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ Success: Connected to MongoDB Atlas'))
        .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

// --- 4. Authentication Routes ---
// (Register and Login routes remain unchanged)

// --- 5. Anime Catalog Routes ---

/**
 * GET ALL ANIMES with Search and Pagination
 * Support for 'limit' and 'skip' allows for true "Load More" behavior.
 */
app.get('/api/animes', async (req, res) => {
    try {
        const { search, limit, skip } = req.query; // Added 'skip'
        let query = {};
        
        if (search && search.trim() !== "") {
            query.Title = { $regex: search, $options: 'i' }; 
        }

        // Convert query params to integers with safe defaults
        const finalLimit = parseInt(limit) || 20; 
        const finalSkip = parseInt(skip) || 0; // Number of items to skip

        // Fetching with skip and limit for efficient pagination
        const animes = await Anime.find(query)
            .sort({ Title: 1 }) // Sort alphabetically for consistent pagination
            .skip(finalSkip)
            .limit(finalLimit);

        console.log(`🔍 Found ${animes.length} animes (Skip: ${finalSkip}, Limit: ${finalLimit})`);
        res.json(animes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE ANIME BY ID
app.get('/api/animes/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (!anime) return res.status(404).json({ message: "Anime not found" });
        res.json(anime);
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format or Server Error" });
    }
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});