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
  }],
  
  // 🚀 NEW: Neural Reviews Field
  // Stores personal ratings and notes for specific records
  reviews: [{
    animeId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Anime', 
      required: true 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 10 
    },
    note: { 
      type: String, 
      maxLength: 500 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

// 🚀 Explicitly targeting the 'animeUser' collection
export default mongoose.model('User', userSchema, 'animeUser');