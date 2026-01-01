# 💎 AnimeVault: Neural Intelligence & Record Management System

**AnimeVault** is a high-performance MERN stack application designed for anime enthusiasts to manage their personal watchlists with a "cyber-vault" aesthetic. It features a neural recommendation engine, real-time analytics, and a fully responsive terminal-style interface.

---

## 🚀 Live Demo
- **Frontend (Vercel):** [Your-Vercel-URL-Here]
- **Backend API (Render):** [Your-Render-URL-Here]

---

## 🛠️ Technical Architecture

### **Frontend**
- **React (Vite):** Ultra-fast frontend framework for a seamless SPA experience.
- **Tailwind CSS:** Custom-themed utility-first CSS for the "Vault" UI.
- **Chart.js:** Data visualization for user genre distribution and era analytics.
- **React Router:** URL-state driven filtering and navigation.

### **Backend**
- **Node.js & Express:** Scalable server architecture.
- **JWT (JSON Web Tokens):** Secure session management and encrypted authentication.
- **Mongoose:** Object Data Modeling for MongoDB interactions.

### **Database**
- **MongoDB Atlas:** Cloud-hosted NoSQL database for flexible anime record storage.

---

## 🧠 Key Features

### 1. **The Catalogue (Smart Filtering)**
An advanced search interface with URL-synced filtering. Users can filter by **Studio**, **Genre**, **Year**, and **Status** simultaneously. The system uses a pipe-separated URL state to allow for shareable filtered views.

### 2. **Neural Match Engine**
A backend algorithm that analyzes the primary genre of any selected anime to provide "Neural Matches." It calculates similarity scores based on genre overlap and global score rankings.

### 3. **Intelligence Feed**
A personalized recommendation system that calculates a **Match Score** (0-99%) for users based on their existing watchlist. It uses frequency-based genre counting to prioritize recommendations that fit the user's specific taste.

### 4. **Vault Analytics Dashboard**
An interactive terminal for users to visualize their habits. 
- **Genre Spread:** A pie chart showing the distribution of genres in their vault.
- **Era Chronology:** A bar chart tracking the decades (90s, 2000s, etc.) of their saved records.

### 5. **Responsive Terminal UI**
A mobile-first design featuring a persistent "Terminal Drawer" navigation, animated logo abbreviations, and adaptive grid layouts for the ultimate cross-device experience.

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/MandrekarAdvit/Anime-Recomendation.git](https://github.com/MandrekarAdvit/Anime-Recomendation.git)

2. **Backend Setup**

Navigate to animeBack.

Create a mong.env file.

Add MONGO_URI and JWT_SECRET.

Run npm install and npm start.

3. **Frontend Setup**

Navigate to my-anime-app.

Run npm install.

Run npm run dev.   