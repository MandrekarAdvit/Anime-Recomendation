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
app.use(cors()); // Critical: Allows your React frontend to talk to this server
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

/**
 * REGISTER NEW USER
 */
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * LOGIN USER
 */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

        // Return token and username for the frontend to store
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. Anime Catalog Routes ---

/**
 * GET ALL ANIMES with Search, Filtering, and Sorting
 */
app.get('/api/animes', async (req, res) => {
    try {
        const { search, limit, skip, sort, year, genre } = req.query; 
        let query = {};
        
        if (search && search.trim() !== "") {
            query.Title = { $regex: search, $options: 'i' }; 
        }

        if (year) {
            if (year === 'Earlier') {
                query["Aired From"] = { $lt: "1980-01-01" };
            } else {
                const decadePrefix = year.substring(0, 3);
                query["Aired From"] = { $regex: `^${decadePrefix}`, $options: 'i' };
            }
        }

        if (genre && genre !== "") {
            query.genres = { $regex: genre, $options: 'i' }; 
        }

        let sortOptions = {};
        if (sort === 'Score') {
            sortOptions = { Score: -1 }; 
        } else if (sort === 'Popularity') {
            sortOptions = { Popularity: 1 }; 
        } else if (sort === 'RecentlyAdded') {
            sortOptions = { "Aired From": -1 }; 
        } else {
            sortOptions = { Title: 1 }; 
        }

        const finalLimit = parseInt(limit) || 20; 
        const finalSkip = parseInt(skip) || 0; 

        const animes = await Anime.find(query)
            .sort(sortOptions)
            .skip(finalSkip)
            .limit(finalLimit);

        res.json(animes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET SINGLE ANIME BY ID
 */
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