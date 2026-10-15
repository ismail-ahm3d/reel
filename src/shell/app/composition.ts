import type { AppDependencies } from '@shell/presentation/dependencies';
import { makeHttpClient } from '@shared/core/data/http/httpClient';
import type { DeviceLocale } from '@shared/core/data/locale/deviceLocale';
import type { KeyValueStorage } from '@shared/core/data/storage/keyValueStorage';
import { makeSecureStorage } from '@shared/core/data/storage/secureStorage';
import { makeAccountWatchlistRemoteDataSource } from '@shared/data/datasources/remote/accountWatchlistRemoteDataSource';
import { makeSessionSecureDataSource } from '@shared/data/datasources/secure/sessionSecureDataSource';
import { makeSessionRepository } from '@shared/data/repositories/sessionRepositoryImpl';
import { authRedirectUrl, systemAuthorizer } from '@shell/app/authorizer';
import { makeAccount } from '@features/account/composition';
import { systemClock } from '@shared/core/data/systemClock';
import { makeGenreRemoteDataSource } from '@shared/data/datasources/remote/genreRemoteDataSource';
import { makeWatchlistStorageDataSource } from '@shared/data/datasources/storage/watchlistStorageDataSource';
import { makeGenreRepository } from '@shared/data/repositories/genreRepositoryImpl';
import { makeWatchlistRepository } from '@shared/data/repositories/watchlistRepositoryImpl';
import { makeGetGenres } from '@shared/domain/usecases/getGenres';
import { makeGetWatchlist } from '@shared/domain/usecases/getWatchlist';
import { makeToggleWatchlist } from '@shared/domain/usecases/toggleWatchlist';
import { makeAddToWatchlist } from '@shared/domain/usecases/addToWatchlist';
import { makeRemoveFromWatchlist } from '@shared/domain/usecases/removeFromWatchlist';
import { makeDiscover } from '@features/discover/composition';
import { makePeople } from '@features/people/composition';
import { makeSearch } from '@features/search/composition';
import { makeTitle } from '@features/title/composition';
import { makeGallery } from '@features/gallery/composition';
import type { Language } from '@features/settings/domain/model/appSettings';
import type { SettingsUseCases } from '@features/settings/domain/usecases/settingsUseCases';

/** The TMDB language tag for each app language; Arabic metadata on TMDB is filed under Saudi Arabia. */
const tmdbLanguage: Readonly<Record<Language, string>> = { en: 'en-US', ar: 'ar-SA' };

export type AppClients = {
  readonly storage: KeyValueStorage;
  readonly locale: DeviceLocale;
  readonly language: Language;
  readonly settings: SettingsUseCases;
};

export const makeAppDependencies = ({ storage, locale, language, settings }: AppClients): AppDependencies => {
  const http = makeHttpClient({
    baseUrl: process.env.EXPO_PUBLIC_TMDB_API_URL ?? 'https://api.themoviedb.org/3',
    timeoutMs: 15_000,
    headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_TOKEN ?? ''}` },
    defaultQuery: { language: tmdbLanguage[language] },
  });
  // Sign-in and lists live on v4; it takes the same read token, and user calls add the user's own.
  const v4 = makeHttpClient({
    baseUrl: (process.env.EXPO_PUBLIC_TMDB_API_URL ?? 'https://api.themoviedb.org/3').replace(/\/3$/, '/4'),
    timeoutMs: 15_000,
    headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_TOKEN ?? ''}` },
    defaultQuery: { language: tmdbLanguage[language] },
  });
  const clock = systemClock;
  const sessions = makeSessionRepository({
    local: makeSessionSecureDataSource({ secure: makeSecureStorage() }),
  });

  const watchlist = makeWatchlistRepository({
    local: makeWatchlistStorageDataSource({ storage }),
    remote: makeAccountWatchlistRemoteDataSource({ http }),
    sessions,
  });
  const genres = makeGenreRepository({ remote: makeGenreRemoteDataSource({ http }) });

  return {
    discover: makeDiscover({ http, clock, region: locale.region }),
    search: makeSearch({ http }),
    title: makeTitle({ http, region: locale.region, language }),
    people: makePeople({ http }),
    watchlist: {
      getWatchlist: makeGetWatchlist({ watchlist }),
      toggleWatchlist: makeToggleWatchlist({ watchlist, clock }),
      addToWatchlist: makeAddToWatchlist({ watchlist, clock }),
      removeFromWatchlist: makeRemoveFromWatchlist({ watchlist }),
    },
    genres: { getGenres: makeGetGenres({ genres }) },
    settings,
    gallery: makeGallery({ http, language }),
    account: makeAccount({
      v3: http,
      v4,
      sessions,
      authorizer: systemAuthorizer,
      redirectUrl: authRedirectUrl,
      language,
    }),
  };
};
