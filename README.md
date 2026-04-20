# Urbyn

Urbyn is a full-stack civic issue reporting and accountability platform built with the MERN stack. It helps citizens report real city problems like potholes, garbage, broken streetlights, drainage issues, and water supply problems, while making the entire lifecycle of each issue public, trackable, and measurable.

## Problem

Most civic complaint systems collect reports, but citizens usually do not get transparency after submission. They often do not know who is responsible, how long the issue should take, whether the issue has crossed its deadline, or whether the final fix is genuine. That creates low trust, duplicate reporting, and weak accountability.

## Solution

Urbyn adds a public accountability layer to civic issue management.

It allows users to:
- log in with Google OAuth
- report issues with image, description, and geolocation
- view issues on a public map
- upvote issues to increase visibility
- track each issue through a clear timeline
- verify fixes publicly

It allows admins to:
- move an issue through workflow states
- add notes to status updates
- upload proof-of-fix images when resolving issues
- monitor ignored issues and department performance

It adds system-level visibility through:
- hotspot areas based on issue concentration
- ignored issues section for unresolved reports beyond deadline
- department ranking and performance scores
- email notifications for issue creation and status changes

## Core features

- Google OAuth login using Passport.js
- issue reporting with Cloudinary image upload
- protected issue creation
- live issue feed with public cards
- interactive map with labels and popups
- hotspot areas ranked by number of reports per area
- ignored issues section for SLA-breaching unresolved reports
- department performance scoreboard and ranking
- before / after fix image visibility
- timeline UI with status events and SLA deadline context
- verify-fix interaction and upvotes
- admin issue drawer with proof-of-fix upload
- email notifications using Nodemailer
- Gemini-based category and severity suggestion fallback

## Tech stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Hot Toast
- React Icons
- Recharts
- React Leaflet / Leaflet

### Backend
- Node.js
- Express.js
- Passport.js
- JWT
- Mongoose
- Nodemailer

### Services
- MongoDB Atlas
- Cloudinary
- Google OAuth
- Gemini API

## Project structure

```txt
urbyn/
  client/
    src/
      api/
      assets/
      components/
      context/
      layouts/
      pages/
      utils/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
  README.md
```

## Local setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd urbyn
```

### 2. Install dependencies

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd ../client
npm install
```

### 3. Configure environment variables

#### `server/.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key
ADMIN_EMAIL=priytoshshahi90@gmail.com

MAIL_FROM=alerts@urbyn.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
```

#### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Run locally

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## How the new features work

### Ignored issues
Every issue gets an SLA deadline based on category and severity. If the issue is still unresolved after that deadline, it becomes part of the ignored issues section.

### Department performance score
Departments are ranked using:
- resolution rate
- within-SLA rate
- average resolution speed
- penalty for open overdue issues

### Hotspot areas
Hotspots are now computed by grouping reports by area and ranking areas by total number of uploaded issues.

### Before / after proof
When an admin resolves an issue, they must provide a proof-of-fix image. This image becomes publicly visible on the issue detail page.

### Email notifications
Nodemailer sends structured emails:
- to admin and reporter when a new issue is created
- to admin and reporter when a status changes

If SMTP credentials are not configured, the app falls back to Nodemailer JSON transport and logs the email payload locally.

## Deployment notes

### Backend on Render
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend on Render
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

For React Router support on Render Static Sites, add this rewrite:
- Source: `/*`
- Destination: `/index.html`
- Action: Rewrite

## Notes

- Do not commit `.env` files or `node_modules`
- Use `.env.example` files in the repo as templates
- Rotate secrets if they have been shared anywhere publicly
- For Gmail SMTP, use an app password, not your main account password

## Future improvements

- duplicate issue detection using Gemini
- severity estimation from image input
- scheduled cron jobs for periodic ignored-issue rechecks
- NGO / volunteer adoption layer
- multilingual support
- Firebase notifications

