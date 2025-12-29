// animeBack/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  watchlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Anime' 
  }] 
}, { timestamps: true });

// 🚀 CHANGE: Explicitly name the collection 'animeUser'
export default mongoose.model('User', userSchema, 'animeUser');