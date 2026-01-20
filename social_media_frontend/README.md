# Social Media Dashboard Frontend (React)

A modern, lightweight React frontend for a social media analytics and profile management dashboard.

## Features
- Analytics, Profile, and Admin pages
- Responsive sidebar + topbar layout
- Session context (select user, auto-load profile)
- API service wired via `REACT_APP_API_BASE_URL`
- Forms and lists for users, profiles, and posts
- Loading and error states
- Minimal dependencies

## Quick Start
1. Copy `.env.example` to `.env` and set the backend URL:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the app:
   ```
   npm start
   ```
   Open http://localhost:3000

## Pages
- Analytics: Overview KPIs and recent posts
- Profile: Select user, edit profile, create/list posts
- Admin: Create/delete users, jump to manage profile

## Tech
- React 18 + react-router-dom
- No heavy UI library; custom CSS with design tokens:
  - primary #3B82F6, secondary #10B981, success #F59E0B, error #EF4444
  - background #f9fafb, surface #ffffff, text #111827

## Environment
- REACT_APP_API_BASE_URL: Backend FastAPI base URL (e.g., http://localhost:3001)

Ensure the backend exposes endpoints:
- GET /analytics/summary
- GET/POST /users, PUT/DELETE /users/{id}
- GET/PUT /profiles/{userId}
- GET/POST /posts, DELETE /posts/{id}

```bash
npm run build   # production build
npm test        # test runner
```
