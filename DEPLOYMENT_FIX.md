# Deployment Fix for Admin Panel

## Problem
Your admin panel works locally but not in production because:

1. **GitHub Pages Deployment**: Static export (`output: 'export'`) means API routes don't run in production
2. **RLS Policies**: Current policies allow anyone to modify data, but API routes aren't accessible

## Solutions

### Option 1: Deploy to Vercel (Recommended)
1. Sign up for Vercel (free tier available)
2. Connect your GitHub repository
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)
4. Deploy - Vercel will automatically run the build and host your API routes

### Option 2: Fix Current GitHub Pages Setup
If you must use GitHub Pages, you need to:
1. Move database operations to client-side (less secure)
2. Use Supabase Row Level Security properly
3. Handle authentication entirely on the client

### Option 3: Use a Different Static Host with Functions
- Netlify with Netlify Functions
- Cloudflare Pages with Functions
- AWS Amplify

## Immediate Fix Steps

1. **Run the RLS fix script**:
   ```sql
   -- Execute the contents of scripts/fix-rls-policies.sql in your Supabase SQL editor
   ```

2. **Update environment variables** for production:
   - Add `SUPABASE_SERVICE_ROLE_KEY` for server-side operations
   - Ensure all Supabase keys are set in your hosting platform

3. **Test authentication flow**:
   - Check that users can log in
   - Verify admin operations work with authenticated sessions

## Recommended: Deploy to Vercel
Vercel is the simplest solution since:
- It supports Next.js API routes out of the box
- Easy environment variable management
- Automatic deployments from GitHub
- Free tier for personal projects
