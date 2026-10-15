# title

The details page of a movie or a show, and a show's season episodes.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: TitleDetailsScreen (`movie/[id].tsx`, `tv/[id]/index.tsx`), SeasonScreen (`tv/[id]/season/[number]/index.tsx`), EpisodeScreen (`…/episode/[episode].tsx`), CreditsScreen (`credits/[type]/[id].tsx`), CollectionScreen (`collection/[id].tsx`), ReviewsScreen (`reviews/[type]/[id].tsx`)
- Slot: `renderAccountBar` on TitleDetailsScreen, filled by the route with the account feature's bar
- Use cases: getTitleDetails, getSeason, getEpisode, getCollection, getReviews, returned by `makeTitle`; watchlist toggling uses shared `WatchlistUseCases`
- Error family: none

## Gotchas
- One request per page: credits, videos, recommendations, providers and ratings come through `append_to_response`.
- Certification and where-to-watch are read for the device region (`expo-localization`).
- The hero shows the title's logo (`images` append, filtered by `include_image_language` app language, en, null) and falls back to the typed title.
- Shows use `aggregate_credits` so long-running casts list every character.
- Reviews are fetched without the app language (nearly all are English), and videos with `include_video_language`, or Arabic users would see none.
