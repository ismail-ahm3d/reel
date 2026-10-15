# account

The user's TMDB account: sign-in, the Library tab (watchlist, favorites, rated, lists, recommendations), list detail, and the signed-in actions on a title page.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: LibraryScreen (`app/(…)/watchlist.tsx`, the Library tab), ListScreen (`list/[id].tsx`); slots TitleAccountBar (title routes) and AccountSection (`app/settings.tsx`)
- Use cases: one per file in `domain/usecases`, returned by `makeAccount` as `AccountUseCases`
- Error family: `AccountError` (signedOut, notApproved, invalidRating, invalidListName), text in `presentation/mappers/accountErrorText.ts`
- Depends on: shared session (`src/shared/domain/model/session.ts`, Keychain/Keystore via expo-secure-store), shared watchlist

## Gotchas
- Sign-in is TMDB v4 (request token, approval in the system auth browser, access token) converted to a v3 session; v3 serves ratings, favorites and the watchlist, v4 serves lists and recommendations with the user's own bearer token.
- The redirect is `reel://auth`; `app/auth.tsx` catches it when Android hands it to the app.
- TMDB gives no dates for watchlist items; the shared repository keeps TMDB's order and spaces synthetic dates a second apart.
- Bulk actions: grids pick titles with shared `useMediaSelection` (Select or long press) and act through `useBulkActions` under the floating `AppActionBar`. v4 list items take arrays (sent in chunks of 50); the v3 watchlist takes one title per request, so the shared repository writes five at a time.
