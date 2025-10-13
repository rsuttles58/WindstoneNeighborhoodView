# Backend API - Neighborhood Decorations

TypeScript backend API for the Neighborhood Holiday Decorations app.

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials and API key

# Initialize database
npm run init-db

# Development mode (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

## Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/decorations_db
GOOGLE_MAPS_API_KEY=your_geocoding_api_key
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Locations

- `GET /api/locations` - Get all locations
- `GET /api/locations?holiday=halloween` - Filter by holiday
- `GET /api/locations/:id` - Get specific location
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Metadata

- `GET /api/properties` - Get available property tags
- `GET /api/holidays` - Get holiday types
- `GET /health` - Health check

## Development

```bash
# Run with auto-reload
npm run dev

# Build TypeScript
npm run build

# Type checking
npx tsc --noEmit
```

## Database Schema

See `scripts/schema.sql` for the full schema.

## Rate Limiting

- General endpoints: 100 requests per 15 minutes
- POST /api/locations: 10 submissions per hour
