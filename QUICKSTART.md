# 🚀 Quick Start Guide

Get the Neighborhood Decorations app running locally in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- PostgreSQL installed and running
- Google Maps API key (see setup below)

## 1. Get Google Maps API Key (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "Maps JavaScript API" and "Geocoding API"
4. Create an API key (no restrictions needed for local development)
5. Copy the API key

## 2. Database Setup (1 minute)

```bash
# Create database
createdb decorations_db
```

## 3. Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://localhost:5432/decorations_db
GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
PORT=3001
NODE_ENV=development
EOF

# Initialize database
npm run init-db

# Start backend
npm run dev
```

Backend will be running at http://localhost:3001

## 4. Frontend Setup (1 minute)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
EOF

# Start frontend
npm start
```

Frontend will open automatically at http://localhost:3000

## 5. Update Map Location

Edit `frontend/src/App.tsx` line 19 to set your neighborhood coordinates:

```typescript
const [mapCenter] = useState({
  lat: 40.7128, // Your latitude
  lng: -74.006, // Your longitude
});
```

## You're Done! 🎉

The app should now be running. Try:

1. Click "Add Location" to submit a decoration
2. Filter by holiday type
3. Click markers to see details

## Troubleshooting

### "Cannot connect to database"

- Make sure PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l | grep decorations_db`

### "Map not loading"

- Verify your Google Maps API key
- Check browser console for errors
- Make sure both Maps JavaScript API and Geocoding API are enabled

### Port already in use

- Backend: Change PORT in `backend/.env`
- Frontend: It will prompt you to use a different port

## Next Steps

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize property tags in `backend/src/config/constants.ts`

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start           # Run compiled code

# Frontend
cd frontend
npm start           # Start dev server
npm run build       # Build for production
```

Happy decorating! 🎃🎄🐰
