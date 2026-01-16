# Deployment Guide

This guide covers deploying the RFP Management System to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A GitHub repository with your code
- A Google Gemini API key
- Chosen a deployment platform

## Platform-Specific Guides

### Vercel (Recommended for Next.js)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables:
     - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key
     - `DATABASE_URL`: Use PostgreSQL for production (see below)
   - Click "Deploy"

3. **Database Setup (Production):**
   
   For production, use PostgreSQL instead of SQLite:
   
   - Add a PostgreSQL database (Vercel Postgres, Supabase, or Neon)
   - Update `DATABASE_URL` in Vercel environment variables
   - Update `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Run migrations in Vercel:
     - Add build command: `npx prisma generate && npx prisma db push && next build`

### Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables in Netlify dashboard
   - Deploy

### Railway

1. **Push to GitHub** (same as above)

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Next.js
   - Add environment variables
   - Add PostgreSQL database from Railway's plugin marketplace
   - Deploy

### Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:20-alpine AS base
   
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t rfp-management .
   docker run -p 3000:3000 -e DATABASE_URL="your-db-url" -e GOOGLE_GENERATIVE_AI_API_KEY="your-key" rfp-management
   ```

## Environment Variables

Ensure these are set in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | `AIza...` |

## Post-Deployment

1. **Verify deployment:**
   - Visit your deployed URL
   - Test key features (RFP creation, vendor management)
   - Check API endpoints

2. **Set up monitoring:**
   - Enable Vercel Analytics (if using Vercel)
   - Set up error tracking (Sentry, LogRocket, etc.)

3. **Database migrations:**
   - For schema changes, run: `npx prisma migrate deploy`
   - Or use: `npx prisma db push` for development

## Troubleshooting

### Build Failures
- Check environment variables are set correctly
- Ensure Prisma Client is generated: `npx prisma generate`
- Review build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is accessible from deployment platform
- Ensure SSL is configured if required

### API Key Issues
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Check API key has proper permissions
- Monitor API usage and quotas

## Security Checklist

- [ ] Environment variables are set (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] Database uses SSL in production
- [ ] API routes have proper validation
- [ ] Rate limiting is configured
- [ ] CORS is properly configured

## Performance Optimization

- Enable caching for static assets
- Use CDN for images and static files
- Configure database connection pooling
- Enable Next.js Image Optimization
- Monitor and optimize API response times
