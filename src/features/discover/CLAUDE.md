# discover

Browsing without a query: the Movies and TV tabs, "See All" category grids, and the filterable browser.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: DiscoverHomeScreen (`app/(…)/index.tsx` movies, `shows.tsx` TV), CategoryScreen (`category/[type]/[category].tsx`), BrowseScreen (`browse/[type].tsx`)
- Use cases: getCategoryPage, browseTitles, getStreamingServices, returned by `makeDiscover` as `DiscoverUseCases`; genres come from shared `GenreUseCases`
- Error family: none
- Depends on: src/shared/domain (media, genre), src/shared/data (TMDB DTOs and mappers)

## Gotchas
- TMDB serves at most 500 pages; `toPage` caps `totalPages`.
- Category pages overlap when rankings shift between requests, so screens de-duplicate by id.
- "Highest rated" and "Newest" add vote floors in the data source, or obscure titles fill the list.
- Browse starts from a `BrowseSource` (genre preselected; keyword, studio or network as `with_keywords`/`with_companies`/`with_networks`); resetting filters keeps the source.
- Streaming services are the region's twenty most prominent, filtered with `with_watch_providers` joined by `|` (any of).
