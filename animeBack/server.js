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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. Vault / Watchlist Routes ---

app.post('/api/watchlist/add', async (req, res) => {
    const { animeId, token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User verification failed." });

        const alreadyExists = user.watchlist.some(id => id.toString() === animeId);
        if (alreadyExists) return res.status(400).json({ message: "Title already secured in your Vault." });

        user.watchlist.push(animeId);
        await user.save();
        
        console.log(`📥 VAULT SYNC: Added ${animeId} to ${user.username}'s profile.`);
        res.json({ message: "Successfully added to your Vault", watchlist: user.watchlist });
    } catch (err) {
        res.status(401).json({ message: "Session expired or invalid. Please login." });
    }
});

/**
 * 🚀 NEW: PERSISTENT DELETE ROUTE
 * Removes the Anime ID from the User's watchlist array in MongoDB.
 */
app.delete('/api/watchlist/remove', async (req, res) => {
    const { animeId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Filter the array to remove the specific Anime ID
        user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
        await user.save();

        console.log(`🗑️ VAULT UPDATE: Expunged ${animeId} from ${user.username}'s profile.`);
        res.json({ message: "Record expunged successfully" });
    } catch (err) {
        console.error("🛑 Expunge Error:", err.message);
        res.status(500).json({ error: "Failed to expunge record from Vault" });
    }
});

app.get('/api/watchlist', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        const user = await User.findById(decoded.id).populate('watchlist');
        res.json(user.watchlist);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch Vault records" });
    }
});

// --- 6. Anime Catalog Routes ---

app.get('/api/animes', async (req, res) => {
    try {
        const { search, limit, skip, sort, year, genre } = req.query; 
        let query = {};
        
        if (search?.trim()) query.Title = { $regex: search, $options: 'i' }; 
        if (genre?.trim()) query.genres = { $regex: genre, $options: 'i' }; 

        if (year) {
            year === 'Earlier' 
                ? query["Aired From"] = { $lt: "1980-01-01" } 
                : query["Aired From"] = { $regex: `^${year.substring(0, 3)}`, $options: 'i' };
        }

        let sortOptions = { Title: 1 };
        if (sort === 'Score') sortOptions = { Score: -1 }; 
        else if (sort === 'Popularity') sortOptions = { Popularity: 1 }; 
        else if (sort === 'RecentlyAdded') sortOptions = { "Aired From": -1 }; 

        const animes = await Anime.find(query)
            .sort(sortOptions)
            .skip(Number(skip) || 0)
            .limit(Number(limit) || 20);

        res.json(animes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/animes/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (!anime) return res.status(404).json({ message: "Anime not found" });
        res.json(anime);
    } catch (err) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});

app.get('/api/animes/:id/similar', async (req, res) => {
    try {
        const { id } = req.params;
        const currentAnime = await Anime.findById(id).lean();
        if (!currentAnime) return res.json([]);

        const rawGenres = currentAnime.genres || currentAnime.Genres || "";
        if (!rawGenres) return res.json([]);

        const primaryGenre = rawGenres.split(',')[0].trim();
        const similarAnimes = await Anime.find({
            _id: { $ne: id },
            $or: [
                { genres: { $regex: primaryGenre, $options: 'i' } },
                { Genres: { $regex: primaryGenre, $options: 'i' } }
            ]
        }).limit(5);

        res.json(similarAnimes);
    } catch (err) {
        res.status(500).json({ error: "Backend failure" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});