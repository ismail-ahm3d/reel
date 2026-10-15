# 0002: Account UI enters other features through slots

Date: 2026-10-15. Status: accepted.

## Context
Signed-in actions (favorite, rate, add to list, sign in and out) belong on the title page and in
Settings, but features may not import each other.

## Decision
The account feature owns those pieces as self-contained components with their own hooks
(`TitleAccountBar`, `AccountSection`). The title and settings screens expose slot props
(`renderAccountBar`, `accountSection`), and the route files fill them. Session and watchlist,
needed by several features, live in `src/shared`; the watchlist repository uses the device while
signed out and the TMDB account while signed in, moving device titles to the account once.

## Consequences
- `TitleAccountBar` and `AccountSection` call use cases outside a screen hook; they are the only
  components that do, and each is a screen in miniature.
- Signing in or out invalidates every query, since the data belongs to someone else.
