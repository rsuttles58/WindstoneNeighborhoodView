# 🚀 Quick Deployment Guide

Get your Neighborhood Decorations app live in ~30 minutes!

## Overview

We'll deploy using 100% FREE services:
- **Backend + Database**: Railway (500 hours/month free)
- **Frontend**: Vercel (unlimited free)
- **Google Maps**: $200/month free credit

## Prerequisites

- [ ] GitHub account
- [ ] Google Cloud account (or Gmail)
- [ ] Your Google Maps API keys ready

---

## Step 1: Prepare Your Code (5 mins)

### 1.1 Initialize Git Repository

```bash
cd /Users/rsuttles58/repos/neighborhood-decorations

# Initialize git
git init

# Create .gitignore if needed
echo "node_modules/
.env
.env.local
dist/
build/
*.log" > .gitignore

# Add all files
git add .
git commit -m "Initial commit: Neighborhood Decorations App"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `neighborhood-decorations`
3. Keep it **Public** or **Private** (your choice)
4. **Don't** initialize with README
5. Click "Create repository"

### 1.3 Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/neighborhood-decorations.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway (10 mins)

### 2.1 Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your repositories

### 2.2 Create New Project

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Railway creates a database automatically ✅

### 2.3 Deploy Backend Service

1. In same project, click "New"
2. Select "GitHub Repo"
3. Choose `neighborhood-decorations`
4. Railway will detect and deploy

### 2.4 Configure Backend

1. Click on your backend service
2. Go to **Settings** → **Root Directory**: `backend`
3. Go to **Settings** → **Build Command**: `npm install && npm run build`
4. Go to **Settings** → **Start Command**: `npm start`

### 2.5 Add Environment Variables

1. Click on backend service
2. Go to **Variables** tab
3. Add these variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
GOOGLE_MAPS_API_KEY=your_backend_google_maps_api_key
NODE_ENV=production
PORT=3001
```

**Note**: Railway auto-links `DATABASE_URL` from your PostgreSQL service!

### 2.6 Get Backend URL

1. Go to **Settings** → **Networking**
2. Click "Generate Domain"
3. Copy the URL (e.g., `your-app-production.up.railway.app`)
4. **Save this URL** - you'll need it for frontend!

### 2.7 Initialize Database

1. Click on your PostgreSQL service
2. Go to **Data** tab
3. Click "Query"
4. Copy and paste the contents of `backend/scripts/schema.sql`
5. Click "Run Query"

---

## Step 3: Deploy Frontend to Vercel (10 mins)

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Select `neighborhood-decorations` repository
3. Click "Import"

### 3.3 Configure Build Settings

1. **Framework Preset**: Select "Create React App"
2. **Root Directory**: Change to `frontend` (click "Edit")
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`

### 3.4 Add Environment Variables

Click "Environment Variables" and add:

```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_frontend_google_maps_api_key
```

**Important**: Replace `your-backend-url` with the Railway URL from Step 2.6!

### 3.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your Vercel URL (e.g., `your-app.vercel.app`)

---

## Step 4: Update Google Maps API Keys (5 mins)

### 4.1 Update Frontend Key Restrictions

1. Go to https://console.cloud.google.com/apis/credentials
2. Click on your **Frontend API Key**
3. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add:
     - `http://localhost:3000/*` (for testing)
     - `https://your-app.vercel.app/*` (your production URL)
     - `https://*.vercel.app/*` (for preview deployments)
4. Click "Save"

### 4.2 Update Backend Key Restrictions

1. Click on your **Backend API Key**
2. Under "Application restrictions":
   - Select "None" (Railway uses rotating IPs)
   - OR get Railway IP: `nslookup your-app.railway.app`
3. Under "API restrictions":
   - Select "Restrict key"
   - Check only "Geocoding API"
4. Click "Save"

---

## Step 5: Test Your Deployment (5 mins)

### 5.1 Test Backend

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/health

# Should return: {"status":"healthy","timestamp":"..."}
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. You should see the map load
3. Try the following:
   - Switch between holidays
   - Open "Filter by Decorations"
   - Click "Add Location" and submit a test location
   - Verify it appears on the map

### 5.3 Check Logs

**Railway**:
- Go to your backend service
- Click "Logs" to see any errors

**Vercel**:
- Go to your deployment
- Click "View Function Logs"

---

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

---

## Common Issues & Fixes

### "Map not loading"
- Check Google Maps API key in Vercel
- Verify domain is whitelisted in Google Cloud Console
- Check browser console for errors

### "Cannot add location"
- Check backend logs in Railway
- Verify DATABASE_URL is connected
- Test backend health endpoint

### "CORS error"
- Backend needs to allow your frontend domain
- Check `backend/src/server.ts` CORS settings

### "Database not initialized"
- Run schema.sql in Railway PostgreSQL Data tab
- Check database connection string

---

## Next Steps

### Custom Domain (Optional)

**Frontend (Vercel)**:
1. Go to project settings → Domains
2. Add your custom domain (e.g., `decorations.yourdomain.com`)
3. Update DNS records as instructed

**Backend (Railway)**:
1. Go to service settings → Networking
2. Add custom domain
3. Update DNS records

### Update CORS for Custom Domain

If using custom domain, edit `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: 'https://your-custom-domain.com',
  credentials: true
}));
```

Then redeploy backend.

---

## Cost Summary

- Railway: **FREE** (500 hours/month, 1GB database)
- Vercel: **FREE** (unlimited bandwidth, 100GB)
- Google Maps: **FREE** ($200/month credit = ~28,000 map loads)
- **Total**: **$0/month** ✅

---

## Support

If you get stuck:
1. Check the logs in Railway/Vercel
2. Review full guide: `DEPLOYMENT.md`
3. Test each component individually
4. Check Google Cloud Console quotas

Happy holidays! 🎃🎄🐰

