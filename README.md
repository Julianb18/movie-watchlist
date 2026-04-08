# Movie Watchlist

Modernized React app for tracking movies and series. It supports:

- Guest mode with `localStorage` persistence.
- Optional user accounts with Supabase auth.
- Cross-device sync for signed-in users.
- TMDB search for both movies and TV series.

## Tech Stack

- React 18
- Vite
- React Router
- Supabase (`@supabase/supabase-js`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
VITE_TMDB_KEY=your_tmdb_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the app:

```bash
npm run dev
```

## Supabase Table

Create a table named `user_movies` with at least these columns:

- `user_id` (uuid, not null)
- `movie_id` (bigint, not null)
- `media_type` (text, not null)
- `list_type` (text, not null; values `watchlist` or `watched`)
- `title` (text, not null)
- `release_date` (text, nullable)
- `poster_path` (text, nullable)

Recommended unique constraint for upserts:

- `(user_id, movie_id, media_type)`

Enable row-level security and policies so users can only read/write their own rows.

## Auth Providers

Enable these Supabase auth providers:

- Email/password
- Google OAuth
