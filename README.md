# Reel

A TMDB client for iOS and Android that feels like a system app: discover, search and save movies and TV shows, with English and Arabic (right-to-left), light and dark themes, and an optional TMDB account for your watchlist, favorites, ratings and lists.

Built with Expo SDK 57, Expo Router native tabs, Unistyles 3 and TanStack Query.

## Features
- Movies and TV home: featured carousel, trending today or this week, popular, top rated, upcoming, by genre
- Browse with filters: sort, genres, streaming services, decade, rating, runtime, original language; by keyword, studio or network
- Search titles, people, collections, studios and keywords
- Title pages with logo artwork, where to watch, cast and crew, seasons and episodes, videos, photos, reviews, collections, recommendations, release dates and links
- People pages with photos, credits by department and links
- Full-screen photo gallery with zoom
- TMDB sign-in: watchlist, favorites, ratings, lists, recommendations, and bulk add or remove

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and add your TMDB v4 read access token
3. `npm run ios` or `npm run android` (a development build; Expo Go cannot run Unistyles)

`npm run check` runs the type check, lint, architecture rules and unit tests.

The token ships inside the JS bundle; use a proxy before any public release.

This product uses the TMDB API but is not endorsed or certified by TMDB.
