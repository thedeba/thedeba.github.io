# Firebase Migration Guide

This document outlines the migration from Supabase to Firebase for the portfolio project.

## Overview

The project has been successfully migrated from Supabase to Firebase with the following changes:

### 1. Dependencies Replaced
- **Removed**: `@supabase/supabase-js`, `@supabase/ssr`, `@supabase/auth-helpers-nextjs`
- **Added**: `firebase`, `firebase-admin`

### 2. Configuration Files

#### Client-side Firebase (`/lib/firebase.ts`)
- Uses Firebase client SDK for browser-side operations
- Requires `NEXT_PUBLIC_FIREBASE_*` environment variables
- Provides `auth`, `db`, and `storage` exports

#### Server-side Firebase Admin (`/lib/firebase-admin.ts`)
- Uses Firebase Admin SDK for server-side operations
- Requires `FIREBASE_*` environment variables (service account)
- Provides `auth` and `db` exports for API routes

### 3. Database Operations

#### New Firebase Data Operations (`/lib/firebase-data.ts`)
- Replaces Supabase operations with Firestore equivalents
- Maintains same interface for all CRUD operations
- Uses Firebase client SDK for client-side operations

#### API Routes Updated
All API routes have been updated to use Firebase Admin SDK:
- `/api/blogs` - Blog CRUD operations
- `/api/projects` - Project CRUD operations  
- `/api/experiences` - Experience CRUD operations
- `/api/contact-messages` - Contact message operations
- `/api/stats` - Statistics management
- `/api/speaking-publications` - Speaking/publications data
- `/api/dummy-activity` - Activity tracking

### 4. Authentication

#### Updated Authentication Context (`/app/contexts/AuthContext.tsx`)
- Replaced Supabase auth with Firebase Auth
- Uses `onAuthStateChanged` for real-time auth state
- Maintains same `useAuth()` hook interface

#### Updated Login Page (`/app/auth/login/page.tsx`)
- Uses `signInWithEmailAndPassword` from Firebase Auth
- Maintains same UI and error handling

#### Updated Admin Components
- Admin dashboard uses Firebase Auth tokens for API calls
- Footer component uses `onAuthStateChanged` for auth state
- StatsManager uses Firebase Auth for authenticated requests

## Environment Variables Setup

### Firebase Client Configuration
Create `.env.local` with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Admin Configuration (for server-side)
```env
# Firebase Admin SDK Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
```

## Firebase Console Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Note your Project ID

### 2. Enable Authentication
1. Go to Authentication → Sign-in method
2. Enable Email/Password authentication
3. Configure your email templates if needed

### 3. Create Service Account
1. Go to Project Settings → Service accounts
2. Click "Create service account"
3. Select "JSON" key type and download
4. Copy the contents to your environment variables

### 4. Set up Firestore Database
1. Go to Firestore Database
2. Create a new database in test mode
3. Update security rules to allow authenticated access for admin operations

### 5. Deploy Configuration
- The project now supports Firebase authentication and Firestore database
- All existing API endpoints work with Firebase
- Client-side authentication uses Firebase Auth

## Data Migration

### Existing Data
- Your existing Supabase data needs to be migrated to Firestore
- Use the Firebase Console or write migration scripts
- Data structure remains the same, only the backend changes

### Collections Structure
The following Firestore collections are used:
- `blogs` - Blog posts
- `projects` - Project portfolio items
- `experiences` - Work/education experiences
- `contact_messages` - Contact form submissions
- `stats` - Statistics data
- `speaking_engagements` - Speaking events
- `publications` - Academic publications
- `dummy_activity` - Activity tracking

## Testing

### Local Development
1. Set up environment variables in `.env.local`
2. Run `npm run dev`
3. Test authentication and CRUD operations

### Production Deployment
1. Set environment variables in your hosting platform
2. Ensure Firebase Admin SDK has proper permissions
3. Test all API endpoints in production

## Troubleshooting

### Common Issues
1. **Build fails with Firebase errors**: Ensure all required environment variables are set
2. **Auth not working**: Check Firebase project configuration and service account permissions
3. **Database operations fail**: Verify Firestore security rules and service account permissions

### Debug Mode
The Firebase configuration includes fallback values for development, but production requires real Firebase credentials.

## Next Steps

1. Set up your Firebase project and get credentials
2. Configure environment variables
3. Test all functionality
4. Deploy with Firebase configuration
5. Migrate existing data from Supabase to Firestore

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
