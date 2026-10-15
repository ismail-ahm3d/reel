# 0001: Native tabs with a native stack per tab

Date: 2026-10-15. Status: accepted.

## Context
The app should feel like a system app on iOS: Liquid Glass tab bar, large titles, the system search field.

## Decision
`NativeTabs` (UITabBarController / BottomNavigationView) at the root, with a native stack per tab. The
Search tab uses `role="search"` so iOS 26 renders it as the separate search tab, and its stack's
header search bar becomes the tab bar search field. Detail routes are shared across tabs with the
array group `(movies,tv,search,watchlist)` so a title opened from any tab stays in that tab.

## Consequences
- Header toolbars and the search bar are `expo-router` components, so they live in route files; the
  search text reaches the screen through the `q` param rather than screen state.
- In-screen actions (watchlist, share, trailer) are buttons in content, not header items.
