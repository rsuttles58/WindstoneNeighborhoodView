# Frontend - Neighborhood Decorations

React + TypeScript frontend for the Neighborhood Holiday Decorations app.

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL and Google Maps key

# Start development server
npm start
```

## Environment Variables

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_javascript_api_key
```

## Available Scripts

```bash
# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (not recommended)
npm run eject
```

## Configuration

### Update Map Center

Edit `src/App.tsx` and change the default coordinates:

```typescript
const [mapCenter] = useState({
  lat: YOUR_LATITUDE, // Your neighborhood latitude
  lng: YOUR_LONGITUDE, // Your neighborhood longitude
});
```

## Components

- **Map.tsx** - Google Maps with markers and info windows
- **LocationForm.tsx** - Form for submitting new locations
- **FilterPanel.tsx** - Holiday filter buttons

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder ready for deployment.

## Deployment

The app can be deployed to:

- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

Make sure to set environment variables in your deployment platform.
