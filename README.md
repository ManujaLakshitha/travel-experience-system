# 🌍 Travel Experience System

A modern full-stack web application built with **Next.js 15**, **MongoDB**, and **Tailwind CSS** that allows users to share and discover unique travel experiences.

## ✨ Features

- **User Authentication:** Secure login and registration using JWT and Bcrypt.
- **Experience Feed:** Browse travel stories with grid and list view toggles.
- **Dynamic Search:** Search by location, title, or description.
- **Advanced Filtering:** Filter by location and sort by price or date.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop screens.
- **Modern UI:** Animated backgrounds and sleek components using Lucide-React.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Mongoose
- **Icons:** Lucide React
- **Date Handling:** Day.js
- **Animations:** CSS Keyframes & Framer Motion (optional)

## 🛠️ Getting Started

### 1. Clone the repository

`git clone [https://github.com/YOUR_USERNAME/travel-experience-system.git](https://github.com/YOUR_USERNAME/travel-experience-system.git)`
`cd travel-experience-system`

### 2. Install dependencies --
`npm install`

### 3. Setup Environment Variables
`MONGODB_URI=your_mongodb_connection_string`
`JWT_SECRET=your_secret_key`

### 4. Run the development server
`npm run dev`

Open http://localhost:3000 with your browser to see the result.

## 📦 Deployment
    This project is optimized for deployment on Vercel.

    1. Push your code to GitHub.
    2. Connect your repository to Vercel.
    3. Add the Environment Variables in the Vercel dashboard.
    4. Deploy!

## 🏗️ Architecture & Key Decisions

### Tech Stack Choice
I chose **Next.js 15 (App Router)** for this project due to its excellent Server-Side Rendering (SSR) capabilities and built-in API routing, which allows for a seamless full-stack development experience. **Tailwind CSS** was used for rapid, responsive UI development, and **MongoDB** was selected for its flexibility in handling unstructured travel listing data.

### Authentication
Authentication is handled using **JSON Web Tokens (JWT)**. When a user logs in, a token is generated and stored on the client side. This token is used to protect private routes like "Create Listing." Passwords are encrypted using **Bcrypt.js** before being stored in the database to ensure high security.

### Data Storage
Travel listings are stored in a MongoDB collection with a schema that includes fields for title, location, description, price, image URL, and a reference to the creator's User ID. This allows us to display the creator's name on the public feed using Mongoose population.

### Future Improvement
If I had more time, I would implement **Image Uploading** (using Cloudinary or AWS S3) instead of relying on Image URLs, providing a better user experience for experience providers.

---

## 🚀 Product Thinking: Scaling to 10,000 Listings

If this platform grows to 10,000 travel listings, the following changes would be essential to maintain performance:

1.  **Pagination & Infinite Scroll:** Instead of fetching all data, I would implement cursor-based pagination to load only 12-20 listings at a time, reducing the initial payload and memory usage.
2.  **Database Indexing:** I would add indexes to frequently searched fields like `location` and `title` in MongoDB to ensure search queries remain lightning-fast.
3.  **Image Optimization:** Using the `next/image` component to automatically resize and serve images in modern formats like WebP would drastically reduce page weight.
4.  **Caching Strategies:** I would implement a caching layer like **Redis** for the most viewed listings and use Incremental Static Regeneration (ISR) to cache public feed pages.
5.  **Search Engine:** For advanced filtering and high-speed search, I would integrate a dedicated search engine like **Algolia** or **Elasticsearch** to provide a better user experience as the dataset expands.

#### Developed by - Manuja Lakshitha