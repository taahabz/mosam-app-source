# Mosam Weather App Frontend

A modern weather forecast application built with React and Material UI.

## Deployment Instructions for Vercel

1. **Connect your GitHub repository to Vercel**
   - Sign in to Vercel and click "Add New" > "Project"
   - Connect to your GitHub repository
   - Select the repository containing this frontend code

2. **Configure the deployment**
   - Framework preset: Vite
   - Root directory: `frontend` (if the repository contains both frontend and backend)
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables**
   - No additional environment variables are needed as the backend URL is hardcoded in the API service

4. **Deploy**
   - Click "Deploy" and wait for the build to complete

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

- Weather dashboard with current conditions
- Historical weather data visualization
- Weather trends analysis
- Admin panel for managing weather data
- Password-protected admin routes
- Responsive design with glass-effect UI
