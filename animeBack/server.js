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
// Modified for deployment: Checks for local file, otherwise uses host variables
const envFile = './mong.env';
if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`📂 Found and loaded local env: ${envFile}`);
} else {
    dotenv.config(); 
    console.log("🌐 Using production environment variables from host.");
}

const app = express();

// 2. Middleware
app.use(cors()); 
app.use(express.json());

// --- 3. JWT Authentication Middleware ---
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
    console.error('🛑 MONGO_URI is undefined! Check host environment settings.');
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

// --- 6. Vault / Watchlist & Review Routes ---
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
        
        res.json({ message: "Successfully added to your Vault", watchlist: user.watchlist });
    } catch (err) {
        res.status(401).json({ message: "Session expired or invalid. Please login." });
    }
});

app.delete('/api/watchlist/remove', authenticateToken, async (req, res) => {
    const { animeId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.watchlist = user.watchlist.filter(id => id.toString() !== animeId);
        user.reviews = user.reviews.filter(r => r.animeId.toString() !== animeId);
        
        await user.save();
        res.json({ message: "Record removed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove record from Vault" });
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

app.post('/api/watchlist/review', authenticateToken, async (req, res) => {
    const { animeId, rating, note } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.reviews.findIndex((r) => r.animeId.toString() === animeId);

        if (index > -1) {
            user.reviews[index].rating = rating;
            user.reviews[index].note = note;
            user.reviews[index].updatedAt = Date.now();
        } else {
            user.reviews.push({ animeId, rating, note });
        }

        await user.save();
        res.json({ message: "Neural Link Synchronized", reviews: user.reviews });
    } catch (err) {
        res.status(500).json({ error: "Failed to sync review with database" });
    }
});

app.get('/api/watchlist/review/:animeId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const review = user.reviews.find(r => r.animeId.toString() === req.params.animeId);
        res.json(review || { rating: 0, note: "" });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch review data" });
    }
});

// --- 7. Catalog & Intelligence Routes ---
app.get('/api/recommendations', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        if (!user) return res.status(404).json({ message: "User not found" });

        const genreCounts = {};
        user.watchlist.forEach(anime => {
            const genresStr = anime.genres || anime.Genres || ""; 
            if (typeof genresStr === 'string') {
                genresStr.split(',').forEach(g => {
                    const trimmed = g.trim();
                    if (trimmed) genreCounts[trimmed] = (genreCounts[trimmed] || 0) + 1;
                });
            }
        });

        const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
        const topUserGenres = sortedGenres.slice(0, 3).map(g => g[0]);

        if (user.watchlist.length === 0) {
            const general = await Anime.find({ Score: { $type: "number", $gte: 8.0 } }).limit(10).lean();
            return res.json(general.map(a => ({ ...a, matchScore: 75 })));
        }

        const securedIds = user.watchlist.map(a => a._id);
        const recommendations = await Anime.find({
            _id: { $nin: securedIds },
            genres: { $in: topUserGenres.map(g => new RegExp(g, 'i')) },
            Score: { $type: "number", $gte: 7.0 } 
        }).limit(15).sort({ Score: -1 }).lean();

        const finalRecs = recommendations.map(anime => {
            const animeGenres = (anime.genres || "").split(',').map(g => g.trim());
            const matchingGenreCount = animeGenres.filter(g => topUserGenres.includes(g)).length;
            let matchScore = 60 + (matchingGenreCount * 12);
            if (typeof anime.Score === 'number') matchScore += (anime.Score / 2);
            return { ...anime, matchScore: Math.min(99, Math.round(matchScore)) };
        });

        res.json(finalRecs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10));
    } catch (err) {
        res.status(500).json([]); 
    }
});

app.get('/api/animes', async (req, res) => {
    try {
        const { search, limit, skip, sort, year, genre, studio, type, status } = req.query; 
        let query = {};
        if (search?.trim()) query.Title = { $regex: search, $options: 'i' }; 
        if (genre?.trim()) query.genres = { $regex: genre, $options: 'i' }; 
        if (studio?.trim()) query.Studios = { $regex: studio, $options: 'i' };
        if (type?.trim()) query.Type = type;
        if (status?.trim()) query.Status = status;

        if (year) {
            year === 'Earlier' 
                ? query["Aired From"] = { $lt: "1980-01-01" } 
                : query["Aired From"] = { $regex: `^${year.substring(0, 4)}`, $options: 'i' };
        }

        query.Score = { $type: "number" };
        let sortOptions = { Popularity: 1 };
        if (sort === 'Score') sortOptions = { Score: -1 }; 
        else if (sort === 'RecentlyAdded') sortOptions = { "Aired From": -1 }; 

        const animes = await Anime.find(query)
            .sort(sortOptions)
            .skip(Number(skip) || 0)
            .limit(Number(limit) || 20)
            .lean();

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
            Score: { $type: "number" },
            $or: [
                { genres: { $regex: primaryGenre, $options: 'i' } },
                { Genres: { $regex: primaryGenre, $options: 'i' } }
            ]
        }).limit(5).lean();

        res.json(similarAnimes);
    } catch (err) {
        res.status(500).json({ error: "Backend failure" });
    }
});

// --- 8. Production Initialization ---
// Use process.env.PORT for production, fallback to 5000 for local dev
const PORT = process.env.PORT || 5000;

// Listening on '0.0.0.0' allows external connections on cloud hosts
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is operational on port ${PORT}`);
});