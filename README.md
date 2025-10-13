# 🎉 Neighborhood Holiday Decorations App

A full-stack TypeScript application for residents to discover and share holiday decorations in their neighborhood. Features an interactive Google Maps interface with location markers for Halloween, Christmas, and Easter decorations.

## 🌟 Features

- **Interactive Map**: Google Maps integration with custom markers for each holiday
- **Public Submissions**: Residents can submit decoration locations with detailed information
- **Holiday Filtering**: Filter locations by holiday type (Halloween, Christmas, Easter)
- **Property Tags**: Categorize decorations with enumerated tags (lights, inflatables, displays, etc.)
- **Responsive Design**: Works on desktop and mobile devices
- **Rate Limiting**: Built-in protection against spam submissions
- **TypeScript**: Full type safety across frontend and backend

## 🏗️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Google Maps JavaScript API** via @react-google-maps/api
- **Axios** for API communication
- **CSS3** for styling

### Backend

- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for data storage
- **Google Maps Geocoding API** for address validation
- **Rate limiting** with express-rate-limit

### Database

- **PostgreSQL** with JSONB support
- **Indexed queries** for fast filtering
- **GIN indexes** for property searching

## 📁 Project Structure

```
neighborhood-decorations/
├── backend/                 # Backend API (TypeScript)
│   ├── src/
│   │   ├── config/         # Database and constants
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Validation middleware
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Database initialization
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Main server file
│   ├── scripts/
│   │   └── schema.sql      # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                # React frontend (TypeScript)
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Map.tsx
    │   │   ├── LocationForm.tsx
    │   │   └── FilterPanel.tsx
    │   ├── services/       # API service layer
    │   ├── types/          # TypeScript types
    │   ├── App.tsx         # Main app component
    │   └── App.css         # Global styles
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Google Cloud account** with Maps API enabled
- **npm** or **pnpm**

### 1. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create two API keys:
   - **Frontend key**: Restrict to HTTP referrers (your domain)
   - **Backend key**: Restrict to IP addresses (your server IP)
5. Set up billing (Google provides $200/month free credit)

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb decorations_db

# Or using psql
psql -U postgres
CREATE DATABASE decorations_db;
\q
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://username:password@localhost:5432/decorations_db
# GOOGLE_MAPS_API_KEY=your_backend_api_key
# PORT=3001
# NODE_ENV=development

# Initialize database schema
npm run init-db

# Start development server
npm run dev
```

The backend will be running at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# REACT_APP_API_URL=http://localhost:3001/api
# REACT_APP_GOOGLE_MAPS_API_KEY=your_frontend_api_key

# Start development server
npm start
```

The frontend will be running at `http://localhost:3000`

### 5. Update Map Center

Edit `frontend/src/App.tsx` and update the map center coordinates to your neighborhood:

```typescript
const [mapCenter] = useState({
  lat: YOUR_LATITUDE, // e.g., 40.7128
  lng: YOUR_LONGITUDE, // e.g., -74.0060
});
```

## 📚 API Endpoints

### Backend API

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| GET    | `/api/locations`                   | Get all locations           |
| GET    | `/api/locations?holiday=halloween` | Get filtered locations      |
| GET    | `/api/locations/:id`               | Get specific location       |
| POST   | `/api/locations`                   | Create new location         |
| PUT    | `/api/locations/:id`               | Update location             |
| DELETE | `/api/locations/:id`               | Delete location             |
| GET    | `/api/properties`                  | Get available property tags |
| GET    | `/api/holidays`                    | Get holiday types           |
| GET    | `/health`                          | Health check                |

### Example POST Request

```json
{
  "address": "123 Main Street, San Francisco, CA",
  "holiday_type": "halloween",
  "properties": ["halloween_lights", "pumpkins", "scary_props"],
  "notes": "Amazing display with fog machine!",
  "submitted_by": "John Doe"
}
```

## 🎨 Available Property Tags

### Halloween

- halloween_lights
- pumpkins
- scary_props
- inflatables
- fog_machine
- skeleton_display
- witch_decor
- graveyard

### Christmas

- christmas_lights
- santa_display
- nativity_scene
- animated_display
- music
- reindeer
- snowman
- inflatable_santa

### Easter

- easter_eggs
- bunny_display
- pastel_lights
- egg_hunt
- easter_baskets
- spring_flowers

## 🚢 Deployment

### Option 1: Free Tier (Recommended)

#### Backend + Database: Railway

1. Go to [Railway.app](https://railway.app)
2. Create new project → "Provision PostgreSQL"
3. Add new service → "Deploy from GitHub"
4. Add environment variables
5. Deploy automatically

#### Frontend: Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set framework preset to "Create React App"
4. Add environment variables
5. Deploy automatically

### Option 2: DigitalOcean

#### Database

- Create Managed PostgreSQL database ($15/month)
- Note connection string

#### Backend

- Deploy to App Platform ($5/month)
- Add environment variables
- Connect to database

#### Frontend

- Deploy to App Platform (Static Site - Free)
- Add environment variables

### Environment Variables for Production

**Backend:**

```
DATABASE_URL=postgresql://user:pass@host:5432/db
GOOGLE_MAPS_API_KEY=your_key
PORT=3001
NODE_ENV=production
```

**Frontend:**

```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_frontend_key
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes (general), 10 submissions per hour
- **Input Validation**: Server-side validation on all inputs
- **CORS**: Configured to accept requests from your domain
- **SQL Injection Protection**: Parameterized queries
- **API Key Restrictions**: Separate keys for frontend/backend with restrictions

## 🧪 Testing

```bash
# Backend
cd backend
npm run build  # Compile TypeScript
npm start      # Run compiled code

# Frontend
cd frontend
npm run build  # Create production build
npm test       # Run tests
```

## 📈 Future Enhancements

- [ ] User authentication for managing submissions
- [ ] Photo uploads for decorations
- [ ] Rating/voting system
- [ ] Directions to locations
- [ ] Mobile app (React Native)
- [ ] Email notifications for new submissions
- [ ] Admin dashboard
- [ ] Export locations to calendar events
- [ ] Social media sharing

## 🐛 Troubleshooting

### Maps not loading

- Verify Google Maps API key is correct
- Check API is enabled in Google Cloud Console
- Ensure billing is set up (free tier available)
- Check browser console for errors

### Database connection errors

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `psql -l`

### CORS errors

- Verify backend CORS is configured correctly
- Check frontend API URL in .env
- Ensure backend is running

### Geocoding failures

- Verify Geocoding API is enabled
- Check API key has proper permissions
- Ensure address format is valid

## 📝 License

MIT License - Feel free to use this for your neighborhood!

## 👥 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💬 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for bringing neighborhoods together during the holidays!
