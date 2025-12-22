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
  // This 'watchlist' field will store the IDs of animes from 
  // your 21,764 records once we finish Day 2!
  watchlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Anime' 
  }] 
}, { timestamps: true });

export default mongoose.model('User', userSchema);