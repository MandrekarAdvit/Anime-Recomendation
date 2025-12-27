import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
    Title: String,
    synopsis: String,
    Score: Number,
    Type: String,
    Status: String,
    Episodes: String,
    Source: String,
    Studios: String,
    photo: String,      // Matches your DB
    genres: String,     // Matches your DB String format
    Aired: String
});

export default mongoose.model('Anime', animeSchema);