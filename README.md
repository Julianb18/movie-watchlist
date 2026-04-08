# Movie Watchlist

A modern movie and series tracker built with React + Vite.

## Features

- Dashboard rails for **Trending Now** and **New Releases**
- Random high-rated picker with optional **genre filters**
- Persistent, debounced global search (`500ms`)
- Watch Next and Seen pages grouped by **Movies** and **Series**
- Media details modal with overview, runtime, genres, rating, language, and trailer
- Supabase auth modal (Email/Password + Google)
- Guest mode with localStorage and optional signed-in cloud sync

## Tech Stack

- React 18
- Vite
- React Router
- Supabase (`@supabase/supabase-js`)
- TMDB API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Add environment variables in `.env`:

```env
VITE_TMDB_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

3. Run locally:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run preview` - preview production build

## Supabase Setup

This app currently uses table **`user_watchlist`**.

### Required columns

- `id` bigint identity primary key
- `user_id` uuid not null references `auth.users(id)` on delete cascade
- `movie_id` bigint not null
- `media_type` text not null (`movie` or `tv`)
- `list_type` text not null (`watchlist` or `watched`)
- `title` text not null
- `release_date` text nullable
- `poster_path` text nullable
- `created_at` timestamptz default `now()`

### Recommended unique index

- `(user_id, movie_id, media_type)`

### RLS

Enable row level security and add policies so authenticated users can only:

- select their own rows
- insert their own rows
- update their own rows
- delete their own rows

## Auth Providers

Enable these in Supabase Authentication:

- Email/password
- Google OAuth

Also configure URL settings:

- Site URL: `http://localhost:5173`
- Redirect URL: `http://localhost:5173`
