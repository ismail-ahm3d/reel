import type { TitleDetails } from '@features/title/domain/model/titleDetails';

/** The TMDB page of a title: what Share sends. */
export const tmdbUrl = (details: TitleDetails): string =>
  `https://www.themoviedb.org/${details.summary.ref.type}/${details.summary.ref.id}`;
