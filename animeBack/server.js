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

// --- 3. JWT Authentication Middleware ---
// Protects routes and provides the user ID to handlers
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: "Session expired. Please login." });
        req.user = user;
        next();
    });
};

// --- 4. Connect to MongoDB ---
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('🛑 MONGO_URI is undefined! Check mong.env');
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log('✅ Success: Connected to MongoDB Atlas'))
        .catch((err) => console.error('❌ MongoDB Connection Error:', err));
}

// --- 5. Authentication Routes ---

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 6. Vault & Personal Rating Logs ---

/**
 * 🚀 POST: Sync Personal Rating & Neural Logs
 * Allows users to record frequencies and observations for secured records.
 */
app.post('/api/watchlist/review', authenticateToken, async (req, res) => {
    const { animeId, rating, note } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const existingReviewIndex = user.reviews.findIndex(r => r.animeId.toString() === animeId);

        if (existingReviewIndex > -1) {
            // Update existing log
            user.reviews[existingReviewIndex].rating = rating;
            user.reviews[existingReviewIndex].note = note;
            user.reviews[existingReviewIndex].updatedAt = Date.now();
        } else {
            // Establish new neural link
            user.reviews.push({ animeId, rating, note });
        }

        await user.save();
        res.json({ message: "Neural Link Synchronized", reviews: user.reviews });
    } catch (err) {
        res.status(500).json({ error: "Failed to sync personal log" });
    }
});

/**
 * 🚀 GET: Fetch Single Personal Log
 */
app.get('/api/watchlist/review/:animeId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const review = user.reviews.find(r => r.animeId.toString() === req.params.animeId);
        res.json(review || { rating: 0, note: "" });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch log data" });
    }
});

app.post('/api/watchlist/add', authenticateToken, async (req, res) => {
    const { animeId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.watchlist.some(id => id.toString() === animeId)) {
            return res.status(400).json({ message: "Title already secured in your Vault." });
        }
        user.watchlist.push(animeId);
        await user.save();
        res.json({ message: "Successfully added to your Vault", watchlist: user.watchlist });
    } catch (err) {
        res.status(500).json({ message: "Vault sync failed" });
    }
});

app.delete('/api/watchlist/remove', authenticateToken, async (req, res) => {
    const { animeId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
        user.reviews = user.reviews.filter(r => r.animeId.toString() !== animeId); // Clean logs
        await user.save();
        res.json({ message: "Record expunged successfully" });
    } catch (err) {
        res.status(500).json({ error: "Expunge failed" });
    }
});

app.get('/api/watchlist', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist').lean();
        res.json(user.watchlist || []);
    } catch (err) {
        res.status(500).json([]);
    }
});

// --- 7. Intelligence & Catalog ---

app.get('/api/recommendations', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist', 'genres Score');
        if (!user || user.watchlist.length === 0) {
            const general = await Anime.find({ Score: { $type: "number", $gte: 8.0 } }).limit(10).lean();
            return res.json(general.map(a => ({ ...a, matchScore: 75 })));
        }

        const genreCounts = {};
        user.watchlist.forEach(anime => {
            (anime.genres || "").split(',').forEach(g => {
                const trimmed = g.trim();
                if (trimmed) genreCounts[trimmed] = (genreCounts[trimmed] || 0) + 1;
            });
        });

        const topUserGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(g => g[0]);
        const securedIds = user.watchlist.map(a => a._id);
        
        const recs = await Anime.find({
            _id: { $nin: securedIds },
            genres: { $in: topUserGenres.map(g => new RegExp(g, 'i')) },
            Score: { $type: "number", $gte: 7.0 } 
        }).limit(10).sort({ Score: -1 }).lean();

        res.json(recs.map(a => ({ ...a, matchScore: 88 })));
    } catch (err) {
        res.status(500).json([]); 
    }
});

app.get('/api/animes', async (req, res) => {
    try {
        const { search, genre, studio, type, status, year, limit, skip } = req.query; 
        let query = { Score: { $type: "number" } };
        
        if (search?.trim()) query.Title = { $regex: search, $options: 'i' }; 
        if (genre?.trim()) query.genres = { $regex: genre, $options: 'i' }; 
        if (studio?.trim()) query.Studios = { $regex: studio, $options: 'i' };
        if (type?.trim()) query.Type = type;
        if (status?.trim()) query.Status = status;
        if (year) query["Aired From"] = { $regex: `^${year.substring(0, 4)}`, $options: 'i' };

        const animes = await Anime.find(query)
            .sort({ Popularity: 1 })
            .skip(Number(skip) || 0)
            .limit(Number(limit) || 20)
            .lean();

        res.json(animes);
    } catch (err) {
        res.status(500).json({ error: "Query failed" });
    }
});

app.get('/api/animes/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        res.json(anime || { message: "Not found" });
    } catch (err) {
        res.status(500).json({ error: "Invalid ID" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is flying on http://localhost:${PORT}`));