import { createContext, useContext, type ReactNode } from 'react';
import type { GenreUseCases, WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import type { DiscoverUseCases } from '@features/discover/domain/usecases/discoverUseCases';
import type { PeopleUseCases } from '@features/people/domain/usecases/peopleUseCases';
import type { SearchUseCases } from '@features/search/domain/usecases/searchUseCases';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import type { SettingsUseCases } from '@features/settings/domain/usecases/settingsUseCases';
import type { GalleryUseCases } from '@features/gallery/domain/usecases/galleryUseCases';
import type { AccountUseCases } from '@features/account/domain/usecases/accountUseCases';

export type AppDependencies = {
  readonly discover: DiscoverUseCases;
  readonly search: SearchUseCases;
  readonly title: TitleUseCases;
  readonly people: PeopleUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly genres: GenreUseCases;
  readonly settings: SettingsUseCases;
  readonly gallery: GalleryUseCases;
  readonly account: AccountUseCases;
};

const DependenciesContext = createContext<AppDependencies | null>(null);

export const DependenciesProvider = ({
  value,
  children,
}: {
  value: AppDependencies;
  children: ReactNode;
}) => <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>;

/** Route files only. Screens and components receive what they need as props. */
export const useDependencies = (): AppDependencies => {
  const value = useContext(DependenciesContext);
  if (value === null) throw new Error('useDependencies outside DependenciesProvider');
  return value;
};
