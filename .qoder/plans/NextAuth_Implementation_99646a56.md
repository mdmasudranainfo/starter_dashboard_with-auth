# NextAuth Implementation Plan

## Overview
Implement a complete authentication system using NextAuth.js that integrates with your backend API at `http://tarashiserver.southasianetwork.org/auth/login`, includes a custom login page, and protects all routes with 30-minute session timeout.

## Tasks

### 1. Install Dependencies
- Install next-auth, @auth/credentials-provider
- Install necessary TypeScript types

### 2. Configure NextAuth
- Create `/pages/api/auth/[...nextauth].js` (or `/app/api/auth/[...nextauth]/route.ts` for App Router)
- Set up Credentials provider with your login API
- Configure session strategy and JWT
- Set session maxAge to 30 minutes

### 3. Create Custom Login Page
- Create `/app/login/page.tsx`
- Implement login form with phone and password fields
- Handle form submission with NextAuth signIn

### 4. Implement Protected Route Logic
- Create middleware to protect all routes
- Redirect unauthenticated users to login page
- Or create a higher-order component for protected routes

### 5. Update Layout Structure
- Modify main layout to exclude protected routes from public access
- Ensure proper session checking

### 6. Session Management
- Configure JWT callbacks to handle user data
- Set up session refresh and expiration handling

## File Changes

### Dependencies to install:
```
npm install next-auth @auth/credentials-provider
```

### Authentication Provider Setup:
- Create `/providers/AuthProvider.tsx` to wrap the app with session provider

### API Route:
- Create `/app/api/auth/[...nextauth]/route.ts` with credentials provider configuration

### Login Page:
- Create `/app/login/page.tsx` with form and error handling

### Middleware:
- Create `/middleware.ts` to protect routes

### Session Hook:
- Create custom hook `useSession` for easy access throughout the app