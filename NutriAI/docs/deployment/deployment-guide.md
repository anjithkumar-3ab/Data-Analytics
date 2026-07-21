# NutriAI Deployment Guide

## 1. Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Python 3.12+
- MongoDB Atlas account (recommended for production)
- A hosting provider such as Vercel, Netlify, Render, Railway, or Azure App Service

## 2. Local development

1. Copy [.env.example](../../.env.example) to .env and update the values.

2. Run:

   - `docker compose up --build`

3. Access:

   - Frontend: <http://localhost:3000>
   - Backend: <http://localhost:8000>
   - MongoDB: <mongodb://localhost:27017>

## 3. Production deployment options

### Frontend

- Deploy the Vite app to Vercel or Netlify.
- Set the environment variable `VITE_API_BASE_URL` to your deployed backend URL.

### Backend

- Deploy the FastAPI app to Render, Railway, or Azure App Service.
- Set the environment variables for MongoDB, JWT, and CORS.

### Database

- Use MongoDB Atlas in production.
- Enable TLS, IP allowlisting, and backups.

## 4. Security checklist

- Use strong JWT secrets.
- Restrict CORS origins.
- Enable HTTPS in production.
- Keep secrets in environment variables or platform secret stores.

## 5. Monitoring and health checks

- Backend health endpoint: `/health`
- Use uptime monitoring and logs on your deployment platform.
