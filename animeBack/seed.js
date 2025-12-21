import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Anime from './models/Anime.js';

// Load connection string
dotenv.config({ path: './mong.env' });

async function seedDatabase() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌱 Connected to MongoDB Atlas...");

    // 2. Read the JSON file
    // This reads the file as a string and converts it to a JavaScript Object
    const rawData = fs.readFileSync('./anime_data.json', 'utf-8');
    const animeData = JSON.parse(rawData);

    console.log(`📑 Found ${animeData.length} anime records in JSON.`);

    // 3. Clear existing data to avoid duplicates
    await Anime.deleteMany({});
    console.log("🧹 Cleared old collection data.");

    // 4. Insert the new data
    await Anime.insertMany(animeData);
    
    console.log("🚀 SUCCESS! Data is now live in the cloud.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();