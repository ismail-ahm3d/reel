# search

Finding a title or a person by name, with suggestions (trending, popular people, genres) before typing.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: SearchScreen (`app/(…)/search.tsx`), query from the `q` param set by the header search bar
- Use cases: searchCatalog, getTrendingNow, getPopularPeople, returned by `makeSearch`
- Error family: none

## Gotchas
- `search/multi` mixes people and titles; the data source parses each hit by its `media_type` and skips kinds it does not know.
- Collections, studios and keywords are separate scopes: `search/multi` covers titles and people only.
