import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({}, { strict: false }); 

export default mongoose.model('Anime', animeSchema);