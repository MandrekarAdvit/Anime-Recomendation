import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import Anime from './models/Anime.js'; // Ensure this path is correct

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

// 4. REST API Routes

// Test Route
app.get('/', (req, res) => {
    res.send('Anime Backend is up and running!');
});

// GET Route: Fetch all animes (limited to 20)
app.get('/api/animes', async (req, res) => {
    try {
        const animes = await Anime.find().limit(20);
        res.status(200).json(animes);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});