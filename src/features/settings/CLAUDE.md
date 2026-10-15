# settings

The Settings sheet: app language (English or Arabic), appearance (system, light, dark) and whether the home carousels move by themselves.
Status: done.

## Shape
- Layers: domain, data, presentation
- Screens: SettingsScreen (`app/settings.tsx`, a modal over the tabs, opened by the gear in each tab's first header)
- Use cases: getSettings, getStartupSettings (synchronous, never fails), updateSettings, returned by `makeSettings`
- Error family: none
- Stored in expo-sqlite kv-store under `settings.v1`

## Gotchas
- The shell applies settings, not this feature: `src/shell/app/boot.ts` reads them before the first frame, `src/shell/app/appearance.ts` applies a theme (Unistyles + `Appearance`) and a language (`I18nManager.forceRTL` + restart).
- Layout direction only changes on restart. Development builds reload with `DevSettings.reload()`; release builds have no expo-updates, so the screen asks the user to reopen the app.
- Language names are written in their own language and not translated.
- `autoplayFeatured` was added to `settings.v1` with a schema default, so records saved before it still parse. The home routes read it through `src/shell/presentation/useAutoplayFeatured.ts`, which shares this feature's query key so the switch applies at once.
