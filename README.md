#  MERN Anime & Movie Catalog
A high-performance full-stack application built to manage and browse a massive library of over **21,700 anime records**.

## Project Overview
This project focuses on handling large-scale datasets in a cloud environment. I migrated a local 21,764-record JSON dataset to **MongoDB Atlas** and built a responsive UI to interact with this data in real-time.

###  Key Engineering Decision: Data-Centric UI
During development, I encountered rate-limiting challenges (HTTP 429) when fetching external posters for 21,000+ entries. I made the strategic decision to implement a **minimalist, data-heavy card design**. This optimized application performance, reduced external dependencies, and focused on providing immediate information density (Scores, Episodes, and Synopses).

##  Tech Stack
- **Frontend**: React.js, Tailwind CSS (Dark Theme).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Cloud Cluster).
- **State Management**: React Context API (Planned).

##  Features
- **Massive Dataset**: Queries 21,764 anime records from the cloud.
- **Optimized Search**: Backend regex search targeting the `Title` field for instant results.
- **Clean Metadata**: Display of Score, Type, Episode count, and Synopsis for every entry.

##  Project Structure
- `/animeBack`: Express server and Mongoose models (`Anime.js`, `User.js`).
- `/my-anime-app`: React frontend with Tailwind-styled components.

### 🗓️ Update: Dec 23, 2025
**Accomplishments:**
* **Theme Synchronization**: Successfully implemented a unified "Emerald-on-Black" aesthetic across the Dashboard, Catalogue, and Vault.
* **Dynamic Pagination**: Added "Load More" functionality to efficiently browse 21,700+ records using backend `limit` and `skip` logic.
* **Routing Overhaul**: Replaced text placeholders with functional React Router paths for Login, Signup, and dynamic Anime Details.
* **Security**: Verified `.gitignore` configuration to protect database credentials in `mong.env`.