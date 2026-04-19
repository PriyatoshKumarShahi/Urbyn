# Urbyn

Urbyn is a MERN civic accountability platform for reporting and tracking city issues with a playful neubrutalist UI. It includes Google OAuth login, Cloudinary image uploads, Leaflet maps, heat-zone analytics, issue upvotes, fix verification, SLA tracking, a super admin dashboard, and Gemini-assisted summaries/category suggestions.

## Stack
- Client: React + Vite + Tailwind CSS + React Router + React Leaflet + Framer Motion + Recharts + React Hot Toast
- Server: Node.js + Express + MongoDB + Mongoose + Passport Google OAuth + JWT + Cloudinary + Multer
- Maps: Leaflet + OpenStreetMap + Nominatim reverse geocoding
- AI: Gemini API (optional)

## Features
- Google OAuth authentication required before creating reports
- Super admin based on email: `priytoshshahi90@gmail.com`
- Cloudinary-backed issue image uploads
- Neubrutalist responsive UI inspired by the reference mockups
- Public issues feed with severity pills, status pills, and department chips
- Upvotes and verify-fix actions
- Delete issue only for creator and admin
- User profile page with initial avatar and self-created issues
- Admin dashboard with table, image previews, deep links to issue cards, and detailed drawer
- Heat zones, hotspot cards, and analytics charts
- SLA and accountability data shown on issue cards and dashboard
- Gemini helper endpoint for category and severity suggestions
- Map markers with issue title, creator, and popup details

## Project Structure
```
urbyn/
  client/
  server/
  README.md
  SLA_PROMPT.md
```

## Quick Start
### 1) Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2) Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Environment Variables
### server/.env
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/urbyn
JWT_SECRET=replace_me
SESSION_SECRET=replace_me
ADMIN_EMAIL=priytoshshahi90@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_key
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Google OAuth Setup
Use a Web OAuth client in Google Cloud Console.

Authorized JavaScript origins:
- `http://localhost:5173`

Authorized redirect URIs:
- `http://localhost:5000/api/auth/google/callback`

## Cloudinary
This project uses signed uploads through the backend `/api/upload` endpoint.

## Seed Data
Create a few issues manually through the UI, or use the example JSON payload in `server/utils/sampleIssue.json`.

## Notes
- The code is structured to be hackathon-ready and scalable, but you should still rotate your own secrets and test every env/config before deployment.
- Reverse geocoding uses Nominatim. Respect rate limits in production and add caching when scaling.
- Gemini integration is optional. The app works without it.

## Deployment
- Client: Vercel or Netlify
- Server: Render or Railway
- DB: MongoDB Atlas
- Assets: Cloudinary

