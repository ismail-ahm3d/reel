import type { Company } from '@shared/domain/model/company';
import type { ExternalLink } from '@shared/domain/model/externalLink';
import type { ImageSet, SizedImage } from '@shared/domain/model/imageSet';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { PersonSummary } from '@shared/domain/model/person';
import type { TitleLogo } from '@shared/domain/model/titleLogo';
import type {
  CompanyDto,
  ExternalIdsDto,
  ImageDto,
  MediaItemDto,
  PageDto,
  PersonItemDto,
} from '@shared/data/datasources/remote/tmdbDto';

const imageBase = 'https://image.tmdb.org/t/p';

/** TMDB's published sizes per kind of artwork, small to large. */
const sizes = {
  poster: ['w185', 'w342', 'w780'],
  backdrop: ['w300', 'w780', 'w1280'],
  profile: ['w185', 'h632', 'h632'],
  logo: ['w92', 'w185', 'w300'],
  titleLogo: ['w300', 'w500', 'original'],
  still: ['w300', 'w780', 'original'],
  /** Gallery images open full screen, so the large size is the original. */
  galleryBackdrop: ['w300', 'w1280', 'original'],
  galleryPoster: ['w342', 'w780', 'original'],
  galleryProfile: ['w185', 'h632', 'original'],
} as const;

export type ImageKind = keyof typeof sizes;

export const toImageSet = (path: string | null | undefined, kind: ImageKind): ImageSet | null => {
  if (path === null || path === undefined || path === '') return null;
  const [small, medium, large] = sizes[kind];
  return {
    small: `${imageBase}/${small}${path}`,
    medium: `${imageBase}/${medium}${path}`,
    large: `${imageBase}/${large}${path}`,
  };
};

/** "2024-05-17" to 2024; TMDB sends "" for unknown dates. */
export const toYear = (date: string | null | undefined): number | null => {
  if (date === null || date === undefined || date.length < 4) return null;
  const year = Number(date.slice(0, 4));
  return Number.isFinite(year) && year > 0 ? year : null;
};

export const toRating = (
  average: number | null | undefined,
  count: number | null | undefined,
): number | null =>
  average === null || average === undefined || !count ? null : Math.round(average * 10) / 10;

/** The list item's own media_type wins; lists of one type omit it, so the caller says which. */
export const toMediaSummary = (dto: MediaItemDto, fallbackType: MediaType): MediaSummary => {
  const type: MediaType =
    dto.media_type === 'tv' || dto.media_type === 'movie' ? dto.media_type : fallbackType;
  return {
    ref: { type, id: dto.id },
    title: (type === 'movie' ? dto.title : dto.name) ?? dto.title ?? dto.name ?? '',
    overview: dto.overview ?? '',
    year: toYear(type === 'movie' ? dto.release_date : dto.first_air_date),
    rating: toRating(dto.vote_average, dto.vote_count),
    voteCount: dto.vote_count ?? 0,
    poster: toImageSet(dto.poster_path, 'poster'),
    backdrop: toImageSet(dto.backdrop_path, 'backdrop'),
    genreIds: dto.genre_ids ?? [],
  };
};

/** Mixed lists (trending/all, known_for) also contain people; this keeps titles only. */
export const isTitleDto = (dto: MediaItemDto): boolean =>
  dto.media_type === undefined ||
  dto.media_type === null ||
  dto.media_type === 'movie' ||
  dto.media_type === 'tv';

export const toPersonSummary = (dto: PersonItemDto): PersonSummary => ({
  id: dto.id,
  name: dto.name,
  department: dto.known_for_department ?? null,
  profile: toImageSet(dto.profile_path, 'profile'),
  knownFor: (dto.known_for ?? [])
    .map((item) => item.title ?? item.name ?? '')
    .filter((title) => title !== ''),
});

export const toPage = <Dto, T>(dto: PageDto<Dto>, map: (item: Dto) => T): Page<T> => ({
  items: dto.results.map(map),
  page: dto.page,
  // TMDB refuses pages above 500 whatever total_pages says.
  totalPages: Math.min(dto.total_pages, 500),
  totalResults: dto.total_results,
});

export const toSizedImages = (
  images: readonly ImageDto[] | null | undefined,
  kind: ImageKind,
): readonly SizedImage[] =>
  (images ?? []).flatMap((dto) => {
    const image = toImageSet(dto.file_path, kind);
    return image === null ? [] : [{ image, aspectRatio: dto.aspect_ratio }];
  });

export const toCompany = (dto: CompanyDto): Company => ({
  id: dto.id,
  name: dto.name,
  logo: toImageSet(dto.logo_path, 'logo'),
});

const present = (value: string | null | undefined): value is string =>
  value !== null && value !== undefined && value.trim() !== '';

/** The external ids TMDB knows, as links, in the order a reader looks for them. */
export const toExternalLinks = (
  ids: ExternalIdsDto | null | undefined,
  homepage: string | null,
  kind: 'title' | 'person',
): readonly ExternalLink[] => {
  const links: ExternalLink[] = [];
  if (homepage !== null) links.push({ kind: 'homepage', url: homepage });
  if (ids === null || ids === undefined) return links;
  if (present(ids.imdb_id))
    links.push({
      kind: 'imdb',
      url: `https://www.imdb.com/${kind === 'person' ? 'name' : 'title'}/${ids.imdb_id}`,
    });
  if (present(ids.instagram_id))
    links.push({ kind: 'instagram', url: `https://www.instagram.com/${ids.instagram_id}` });
  if (present(ids.twitter_id)) links.push({ kind: 'twitter', url: `https://x.com/${ids.twitter_id}` });
  if (present(ids.tiktok_id)) links.push({ kind: 'tiktok', url: `https://www.tiktok.com/@${ids.tiktok_id}` });
  if (present(ids.youtube_id))
    links.push({ kind: 'youtube', url: `https://www.youtube.com/${ids.youtube_id}` });
  if (present(ids.facebook_id))
    links.push({ kind: 'facebook', url: `https://www.facebook.com/${ids.facebook_id}` });
  if (present(ids.wikidata_id))
    links.push({ kind: 'wikidata', url: `https://www.wikidata.org/wiki/${ids.wikidata_id}` });
  return links;
};

/** The best-voted logo in the app language, else English, else one without text language. */
export const toTitleLogo = (
  logos: readonly ImageDto[] | null | undefined,
  language: string,
): TitleLogo | null => {
  const rank = (logo: ImageDto): number =>
    logo.iso_639_1 === language ? 0 : logo.iso_639_1 === 'en' ? 1 : logo.iso_639_1 ? 3 : 2;
  const best = [...(logos ?? [])].sort(
    (a, b) => rank(a) - rank(b) || (b.vote_average ?? 0) - (a.vote_average ?? 0),
  )[0];
  const image = best === undefined ? null : toImageSet(best.file_path, 'titleLogo');
  return best === undefined || image === null ? null : { image, aspectRatio: best.aspect_ratio };
};
