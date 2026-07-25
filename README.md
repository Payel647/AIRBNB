# WanderLust

A Node.js/Express Airbnb-style listing app built with EJS templates, MongoDB, user authentication, booking management, and a simple chatbot experience.

## Features

- User authentication with Passport.js
- Listing creation, editing, and deletion
- Image upload using Cloudinary
- Category browsing and search
- Booking creation with availability validation
- User reviews and review management
- Interactive chatbot page for user questions
- Map geocoding for listing locations
- Flash messages for success/error feedback

## Technologies

- Node.js
- Express
- MongoDB / Mongoose
- EJS + EJS Mate
- Passport.js + passport-local-mongoose
- Cloudinary + multer-storage-cloudinary
- Joi validation
- connect-flash, express-session, connect-mongo
- Bootstrap 5

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd airbnb
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file at the project root with the following variables:

```env
NODE_ENV=development
SECRET=your_session_secret
DS=mongodb+srv://... or mongodb://localhost:27017/your-db-name
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TILER_KEY=your_maptiler_api_key
MAP_API_KEY=your_mapbox_or_maptiler_api_key
```

4. Start the app:

```bash
node app.js
```

5. Open the app in your browser:

```text
http://localhost:8080
```

## Project Structure

- `app.js` — main Express application setup
- `routes/` — route handlers for listings, reviews, users, and bookings
- `controllers/` — controller logic for listings, users, and reviews
- `models/` — Mongoose schemas for Listing, Review, Booking, and User
- `views/` — EJS templates for pages and layouts
- `public/` — static CSS and JavaScript files
- `cloudconfig.js` — Cloudinary storage configuration
- `middleware.js` — authentication and request validation helpers

## Key Routes

- `GET /listings` — browse all listings
- `GET /listings/new` — create a new listing
- `POST /listings` — save a listing
- `GET /listings/:id` — view a listing
- `GET /listings/:id/edit` — edit a listing
- `PUT /listings/:id` — update a listing
- `DELETE /listings/:id` — delete a listing
- `GET /listings/category/:category` — show category listings
- `GET /listings/search` — search listings
- `GET /bookings` — view current user bookings
- `POST /bookings` — create a booking
- `GET /chatbot` — open chatbot page
- `GET /signup` — sign up page
- `GET /login` — login page
- `GET /logout` — log out

## Environment Notes

- The app expects MongoDB connection string in `DS`.
- Cloudinary is required for image uploads.
- Map geocoding is used when creating listings.
- The app listens on port `8080` by default.
