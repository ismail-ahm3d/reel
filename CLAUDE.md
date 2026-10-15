# Reel

A TMDB client for browsing, searching and saving movies and TV shows, built to feel like a system app.
Platforms: iOS, Android. Expo SDK 57, Expo Router, development builds (`ios/` and `android/` are generated, never committed). TypeScript `strict`.
Package manager: npm. Layout: the ts-react-native-plugin `project-layout` grammar.
Server state: TanStack Query over use cases, memory only. Design system: Unistyles 3, wrapper prefix `App`. Variants: standard via `EXPO_PUBLIC_APP_VARIANT`.
Storage: expo-sqlite key-value store. Translations: English and Arabic dictionaries behind `useTranslate()` (`src/shared/core/presentation/i18n/`), language provided by the shell.

## Build and test
- Install: `npm install` (peer conflicts in the Expo 57 tree need `--legacy-peer-deps` for new dev packages)
- Run: `npm run ios` builds and launches the development build; afterwards `npm start` serves JS to it
- Everything CI checks: `npm run check` (type check, lint, architecture rules, unit tests)
- Unit tests only: `npm test`
- Requires `.env.local` with `EXPO_PUBLIC_TMDB_TOKEN` (TMDB v4 read access token) and `EXPO_PUBLIC_TMDB_API_URL`.
- Unistyles needs a development build: Expo Go cannot run the app.

## Where things are
- Conventions: the ts-react-native-plugin skills. Follow them; they are not restated here.
- Feature context: `src/features/<feature>/CLAUDE.md`, loads when you work there.
- Decisions: `docs/decisions/`.
- Current state: `docs/STATUS.md`.

## Repo-specific rules
- The root is a stack holding `(tabs)` and the `settings` modal. Tabs are native (`expo-router/unstable-native-tabs` on SDK 57) and each tab owns a native stack. Shared detail routes live once in `app/(tabs)/(movies,tv,search,watchlist)/` (array group syntax); anchors are in that group's `_layout.tsx`.
- `src/shell/app/boot.ts` runs before the first frame: saved settings, theme, layout direction, then the dependencies for that language. Every new string needs a key in both `en.ts` and `ar.ts`; use `marginStart`/`End` and `directional` icons so layouts mirror in Arabic.
- Right-to-left details: routes ask for large titles through `largeTitles` (`src/shell/presentation/largeTitles.*.ts`; off in Arabic on iOS, where iOS 26 breaks Arabic large titles), pagers read their page with `scrollPage` (offsets are mirrored in RTL), `AppText` drops letter spacing in RTL, and TMDB department names go through `departmentText`.
- Route callbacks come from `src/shell/presentation/navigation.ts` (`appNavigation`); routes do not build paths themselves.
- The gallery (`app/gallery.tsx`) and Settings (`app/settings.tsx`) are modals on the root stack; `app/auth.tsx` catches the TMDB sign-in redirect.
- Account UI reaches the title page and Settings through slot props filled by the routes (`docs/decisions/0002-account-slots.md`).
- A second HTTP client points at TMDB v4 for sign-in and lists; the session lives in the Keychain/Keystore (expo-secure-store).
- The search query lives in the `q` route param, written by the native header search bar.
- Data used by several features (session, watchlist, genres, `MediaSummary`, browse sources, gallery sources, TMDB DTOs and mappers) lives in `src/shared/{domain,data,presentation}`.
- Jest's test query client turns off mutation garbage collection; without it the 5-minute timer keeps Jest from exiting.
- The TMDB token ships in the JS bundle (`EXPO_PUBLIC_*`); it is a read-only token. Use a proxy before a public release.

## Compaction
When compacting, keep the list of files modified this session and any decision made in this session.
