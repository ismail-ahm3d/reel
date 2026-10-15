/** The EXPO_PUBLIC_ variables the app reads; Metro inlines them at build time. */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_TMDB_API_URL?: string;
    readonly EXPO_PUBLIC_TMDB_TOKEN?: string;
    readonly EXPO_PUBLIC_APP_VARIANT?: string;
  }
}
