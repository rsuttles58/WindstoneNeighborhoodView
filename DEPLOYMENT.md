# Deployment Guide

Comprehensive guide for deploying the Neighborhood Decorations app to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Maps Setup](#google-maps-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Post-Deployment](#post-deployment)

## Prerequisites

- GitHub account (for repository)
- Google Cloud account (for Maps API)
- Railway or Render account (for backend)
- Vercel account (for frontend)

## Google Maps Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "neighborhood-decorations"
4. Click "Create"

### 2. Enable APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - **Maps JavaScript API** (for frontend map)
   - **Geocoding API** (for backend address validation)

### 3. Create API Keys

#### Frontend Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API key"
3. Name it "Frontend Key"
4. Click "Restrict Key"
5. Under "Application restrictions", select "HTTP referrers"
6. Add your domains:
   - `http://localhost:3000/*` (development)
   - `https://your-app.vercel.app/*` (production)
7. Under "API restrictions", select "Restrict key"
8. Choose "Maps JavaScript API"
9. Save

#### Backend Key

1. Create another API key
2. Name it "Backend Key"
3. Under "Application restrictions", select "IP addresses"
4. Add your backend server IPs (get from Railway/Render)
5. Under "API restrictions", select "Geocoding API"
6. Save

### 4. Enable Billing

1. Go to "Billing"
2. Link a payment method
3. Google provides $200/month free credit
4. Set up budget alerts at $50, $100, $150

## Database Setup

### Option 1: Railway (Recommended for Free Tier)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Railway automatically creates a PostgreSQL database
5. Click on the database → "Connect"
6. Copy the "Postgres Connection URL"
7. Save this for backend environment variables

### Option 2: Render

1. Go to [Render.com](https://render.com)
2. Sign up
3. Click "New +" → "PostgreSQL"
4. Name: `decorations-db`
5. Database: `decorations_db`
6. User: `decorations_user`
7. Region: Choose closest to your users
8. Plan: Free tier
9. Click "Create Database"
10. Copy "External Database URL"

### Option 3: Supabase (Alternative Free Option)

1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Use SQL Editor to run schema

## Backend Deployment

### Railway Deployment

1. **Push code to GitHub**

   ```bash
   cd neighborhood-decorations
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Deploy to Railway**

   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure Backend Service**

   - Click on your service
   - Go to "Settings" → "Root Directory"
   - Set to: `backend`
   - Go to "Settings" → "Build Command"
   - Set to: `npm install && npm run build`
   - Go to "Settings" → "Start Command"
   - Set to: `npm start`

4. **Set Environment Variables**

   - Go to "Variables" tab
   - Add:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     GOOGLE_MAPS_API_KEY=your_backend_api_key
     NODE_ENV=production
     PORT=3001
     ```
   - Railway auto-links database URL if in same project

5. **Initialize Database**

   - In Railway, go to database service
   - Click "Query" or "Connect"
   - Run the schema from `backend/scripts/schema.sql`
   - Or SSH into backend service and run: `npm run init-db`

6. **Get Backend URL**
   - Go to "Settings" → "Domains"
   - Railway provides: `your-app.up.railway.app`
   - Or add custom domain

### Render Deployment

1. **Create Web Service**

   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Name: `decorations-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

2. **Environment Variables**

   - Add environment variables:
     ```
     DATABASE_URL=postgresql://...
     GOOGLE_MAPS_API_KEY=your_key
     NODE_ENV=production
     ```

3. **Initialize Database**
   - Connect to database via provided URL
   - Run schema from `backend/scripts/schema.sql`

## Frontend Deployment

### Vercel Deployment (Recommended)

1. **Prepare Frontend**

   ```bash
   cd frontend
   npm run build  # Test build locally
   ```

2. **Deploy to Vercel**

   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Create React App`
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`

3. **Environment Variables**

   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend.railway.app/api
     REACT_APP_GOOGLE_MAPS_API_KEY=your_frontend_api_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel provides: `your-app.vercel.app`
   - Can add custom domain in settings

### Netlify (Alternative)

1. **Deploy to Netlify**

   - Go to [Netlify.com](https://netlify.com)
   - Drag and drop `frontend/build` folder
   - Or connect GitHub repository

2. **Configure**

   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add same variables as Vercel

## Post-Deployment

### 1. Update Google Maps API Restrictions

**Frontend Key:**

- Add production domain to HTTP referrers
- Example: `https://your-app.vercel.app/*`

**Backend Key:**

- Add Railway/Render IP addresses
- Get from: `nslookup your-backend-url`

### 2. Test Deployment

1. **Health Check**

   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Test API**

   ```bash
   curl https://your-backend.railway.app/api/holidays
   ```

3. **Test Frontend**
   - Visit your Vercel URL
   - Try submitting a location
   - Check map loads correctly

### 3. Configure CORS

If having CORS issues:

1. Edit `backend/src/server.ts`:

   ```typescript
   app.use(
     cors({
       origin: 'https://your-frontend.vercel.app',
       credentials: true,
     })
   );
   ```

2. Redeploy backend

### 4. Set Up Monitoring

**Railway/Render:**

- Check logs regularly
- Set up error alerts
- Monitor resource usage

**Vercel:**

- Check deployment logs
- Monitor function invocations
- Set up analytics

### 5. Custom Domain (Optional)

**Frontend (Vercel):**

1. Go to project settings → "Domains"
2. Add custom domain
3. Update DNS records
4. Vercel auto-provisions SSL

**Backend (Railway):**

1. Go to service settings → "Domains"
2. Add custom domain
3. Update DNS records

## Cost Estimates

### Free Tier (Recommended for Start)

- **Railway Database**: Free (500 hours/month, 1GB)
- **Railway Backend**: Free (500 hours/month)
- **Vercel Frontend**: Free (100GB bandwidth)
- **Google Maps**: Free ($200/month credit)
- **Total**: $0/month (with limitations)

### Paid Tier (High Traffic)

- **Railway**: $5-20/month (more resources)
- **DigitalOcean DB**: $15/month (Managed PostgreSQL)
- **DigitalOcean Apps**: $5/month (backend)
- **Vercel Pro**: $20/month (better limits)
- **Google Maps**: $200 credit covers ~28k map loads
- **Total**: ~$40-60/month

## Troubleshooting

### Backend not starting

- Check logs in Railway/Render
- Verify DATABASE_URL is set
- Check Node.js version compatibility

### Database connection errors

- Verify DATABASE_URL format
- Check database is running
- Run schema initialization

### Maps not loading

- Check API key restrictions
- Verify domain whitelist
- Check browser console errors

### CORS errors

- Update CORS configuration
- Verify frontend URL in backend
- Check network tab in browser

## Maintenance

### Regular Tasks

- Monitor error logs weekly
- Check API usage monthly
- Update dependencies quarterly
- Review and optimize database indexes

### Scaling Considerations

- Add Redis for caching when traffic grows
- Consider CDN for static assets
- Implement database connection pooling
- Add load balancing for backend

## Support

If you encounter issues:

1. Check deployment logs
2. Review environment variables
3. Test API endpoints individually
4. Check Google Cloud Console for API issues

---

Congratulations! Your app is now live! 🎉
