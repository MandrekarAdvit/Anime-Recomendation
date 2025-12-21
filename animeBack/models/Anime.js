// animeBack/models/Anime.js
import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  Title: String,    // Note the Capital 'T'
  synopsis: String, // Note the lowercase 's'
  Score: Number,    // Note the Capital 'S'
  Type: String,
  Episodes: Number,
  id: Number
}, { 
  collection: 'animes' // Points to the new collection
});

export default mongoose.model('Anime', animeSchema);