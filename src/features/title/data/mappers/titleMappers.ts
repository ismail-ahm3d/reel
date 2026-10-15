import {
  toCompany,
  toExternalLinks,
  toImageSet,
  toMediaSummary,
  toPage,
  toRating,
  toSizedImages,
  toTitleLogo,
  toYear,
} from '@shared/data/mappers/tmdbMappers';
import type { ImageDto, MediaItemDto } from '@shared/data/datasources/remote/tmdbDto';
import type { MediaSummary, MediaType, Page } from '@shared/domain/model/media';
import type { Collection } from '@features/title/domain/model/collection';
import type { EpisodeDetails } from '@features/title/domain/model/episode';
import type { SeasonDetails } from '@features/title/domain/model/season';
import type {
  CastMember,
  CrewMember,
  Release,
  ReleaseKind,
  Review,
  TitleDetails,
  Video,
  VideoKind,
  WatchOptions,
  WatchProvider,
} from '@features/title/domain/model/titleDetails';
import type {
  CastDto,
  CollectionDto,
  CrewDto,
  EpisodeDto,
  MovieDetailsDto,
  ProviderDto,
  RegionProvidersDto,
  ReviewDto,
  ReviewPageDto,
  SeasonDto,
  TvDetailsDto,
  VideoDto,
} from '@features/title/data/datasources/remote/titleDto';

const nonEmpty = (value: string | null | undefined): string | null =>
  value === null || value === undefined || value.trim() === '' ? null : value;

const videoKinds: Readonly<Record<string, VideoKind>> = {
  Trailer: 'trailer',
  Teaser: 'teaser',
  Clip: 'clip',
  Featurette: 'featurette',
  'Behind the Scenes': 'behindTheScenes',
};

/** YouTube only: the one site every device can play. */
const toVideos = (videos: readonly VideoDto[] | undefined): readonly Video[] =>
  (videos ?? [])
    .filter((video) => video.site === 'YouTube')
    .map((video) => ({
      id: video.id,
      name: video.name,
      kind: videoKinds[video.type] ?? 'other',
      official: video.official ?? false,
      url: `https://www.youtube.com/watch?v=${video.key}`,
      thumbnail: `https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`,
    }));

const toProviders = (providers: readonly ProviderDto[] | null | undefined): readonly WatchProvider[] =>
  [...(providers ?? [])]
    .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0))
    .map((provider) => ({
      id: provider.provider_id,
      name: provider.provider_name,
      logo: toImageSet(provider.logo_path, 'logo'),
    }));

const toWatchOptions = (region: RegionProvidersDto | undefined): WatchOptions | null => {
  if (region === undefined) return null;
  const options: WatchOptions = {
    link: nonEmpty(region.link),
    stream: toProviders(region.flatrate),
    free: toProviders([...(region.free ?? []), ...(region.ads ?? [])]),
    rent: toProviders(region.rent),
    buy: toProviders(region.buy),
  };
  const any = options.stream.length + options.free.length + options.rent.length + options.buy.length > 0;
  return any ? options : null;
};

/** Gallery images without text first (they read in every language), best voted first. */
const byGalleryOrder = (images: readonly ImageDto[] | null | undefined): readonly ImageDto[] =>
  [...(images ?? [])].sort(
    (a, b) =>
      Number(a.iso_639_1 != null) - Number(b.iso_639_1 != null) ||
      (b.vote_average ?? 0) - (a.vote_average ?? 0),
  );

const toRecommendations = (
  recommendations: readonly MediaItemDto[] | undefined,
  similar: readonly MediaItemDto[] | undefined,
  type: MediaType,
): readonly MediaSummary[] => {
  const primary = recommendations ?? [];
  return (primary.length > 0 ? primary : (similar ?? [])).map((dto) => toMediaSummary(dto, type));
};

const uniqueCrew = (crew: readonly CrewMember[]): readonly CrewMember[] => {
  const seen = new Set<number>();
  return crew.filter((member) => !seen.has(member.personId) && seen.add(member.personId));
};

const toCast = (dto: CastDto): CastMember => ({
  personId: dto.id,
  name: dto.name,
  role: nonEmpty(dto.character),
  profile: toImageSet(dto.profile_path, 'profile'),
  episodeCount: null,
});

const toCrew = (dto: CrewDto): CrewMember => ({
  personId: dto.id,
  name: dto.name,
  job: dto.job ?? '',
  department: dto.department ?? '',
  profile: toImageSet(dto.profile_path, 'profile'),
});

/** TMDB's release type numbers. */
const releaseKinds: Readonly<Record<number, ReleaseKind>> = {
  1: 'premiere',
  2: 'limited',
  3: 'theatrical',
  4: 'digital',
  5: 'physical',
  6: 'tv',
};

const toReleases = (dto: MovieDetailsDto, region: string): readonly Release[] =>
  (dto.release_dates?.results.find((result) => result.iso_3166_1 === region)?.release_dates ?? [])
    .flatMap((release) => {
      const kind = releaseKinds[release.type ?? 0];
      const date = nonEmpty(release.release_date)?.slice(0, 10) ?? null;
      return kind === undefined || date === null
        ? []
        : [{ kind, date, certification: nonEmpty(release.certification), note: nonEmpty(release.note) }];
    })
    .sort((a, b) => a.date.localeCompare(b.date));

/** Shared by movies and shows: artwork, companies, links. */
const extras = (dto: MovieDetailsDto | TvDetailsDto, language: string) => ({
  logo: toTitleLogo(dto.images?.logos, language),
  images: {
    backdrops: toSizedImages(byGalleryOrder(dto.images?.backdrops), 'galleryBackdrop'),
    posters: toSizedImages(byGalleryOrder(dto.images?.posters), 'galleryPoster'),
  },
  companies: (dto.production_companies ?? []).map(toCompany),
  links: toExternalLinks(dto.external_ids, nonEmpty(dto.homepage), 'title'),
});

export const movieToDetails = (dto: MovieDetailsDto, region: string, language: string): TitleDetails => {
  const crew = (dto.credits?.crew ?? []).map(toCrew);
  const regionRelease = dto.release_dates?.results.find((result) => result.iso_3166_1 === region);
  const certification =
    regionRelease?.release_dates
      .map((release) => nonEmpty(release.certification))
      .find((value) => value !== null) ?? null;
  const summary: MediaSummary = {
    ref: { type: 'movie', id: dto.id },
    title: dto.title,
    overview: dto.overview ?? '',
    year: toYear(dto.release_date),
    rating: toRating(dto.vote_average, dto.vote_count),
    voteCount: dto.vote_count ?? 0,
    poster: toImageSet(dto.poster_path, 'poster'),
    backdrop: toImageSet(dto.backdrop_path, 'backdrop'),
    genreIds: (dto.genres ?? []).map((genre) => genre.id),
  };
  const collection = dto.belongs_to_collection;
  return {
    summary,
    ...extras(dto, language),
    keywords: dto.keywords?.keywords ?? [],
    originalTitle: dto.original_title ?? dto.title,
    tagline: nonEmpty(dto.tagline),
    genres: dto.genres ?? [],
    releaseDate: nonEmpty(dto.release_date),
    runtimeMinutes: dto.runtime ? dto.runtime : null,
    certification,
    status: nonEmpty(dto.status),
    originalLanguage: nonEmpty(dto.original_language),
    budget: dto.budget ? dto.budget : null,
    revenue: dto.revenue ? dto.revenue : null,
    homepage: nonEmpty(dto.homepage),
    cast: (dto.credits?.cast ?? []).map(toCast),
    crew,
    creators: uniqueCrew(crew.filter((member) => member.job === 'Director')),
    writers: uniqueCrew(crew.filter((member) => member.department === 'Writing')).slice(0, 4),
    collection:
      collection === null || collection === undefined
        ? null
        : {
            id: collection.id,
            name: collection.name,
            poster: toImageSet(collection.poster_path, 'poster'),
            backdrop: toImageSet(collection.backdrop_path, 'backdrop'),
          },
    releases: toReleases(dto, region),
    videos: toVideos(dto.videos?.results),
    watch: toWatchOptions(dto['watch/providers']?.results[region]),
    recommendations: toRecommendations(dto.recommendations?.results, dto.similar?.results, 'movie'),
    show: null,
  };
};

export const tvToDetails = (dto: TvDetailsDto, region: string, language: string): TitleDetails => {
  const summary: MediaSummary = {
    ref: { type: 'tv', id: dto.id },
    title: dto.name,
    overview: dto.overview ?? '',
    year: toYear(dto.first_air_date),
    rating: toRating(dto.vote_average, dto.vote_count),
    voteCount: dto.vote_count ?? 0,
    poster: toImageSet(dto.poster_path, 'poster'),
    backdrop: toImageSet(dto.backdrop_path, 'backdrop'),
    genreIds: (dto.genres ?? []).map((genre) => genre.id),
  };
  // A show's crew member holds several jobs over its run; each becomes one credit.
  const crew = (dto.aggregate_credits?.crew ?? []).flatMap((member) =>
    (member.jobs ?? [{ job: '' }]).map((job) => ({
      personId: member.id,
      name: member.name,
      job: job.job,
      department: member.department ?? '',
      profile: toImageSet(member.profile_path, 'profile'),
    })),
  );
  const certification = nonEmpty(
    dto.content_ratings?.results.find((result) => result.iso_3166_1 === region)?.rating,
  );
  const seasons = (dto.seasons ?? [])
    // Specials (season 0) go last, the way streaming apps list them.
    .sort((a, b) =>
      a.season_number === 0 ? 1 : b.season_number === 0 ? -1 : a.season_number - b.season_number,
    )
    .map((season) => ({
      number: season.season_number,
      name: season.name ?? '',
      episodeCount: season.episode_count ?? 0,
      year: toYear(season.air_date),
      poster: toImageSet(season.poster_path, 'poster'),
    }))
    .filter((season) => season.episodeCount > 0);
  const next = dto.next_episode_to_air;
  return {
    summary,
    ...extras(dto, language),
    keywords: dto.keywords?.results ?? [],
    originalTitle: dto.original_name ?? dto.name,
    tagline: nonEmpty(dto.tagline),
    genres: dto.genres ?? [],
    releaseDate: nonEmpty(dto.first_air_date),
    runtimeMinutes: dto.episode_run_time?.[0] ?? null,
    certification,
    status: nonEmpty(dto.status),
    originalLanguage: nonEmpty(dto.original_language),
    budget: null,
    revenue: null,
    homepage: nonEmpty(dto.homepage),
    cast: (dto.aggregate_credits?.cast ?? []).map((member) => ({
      personId: member.id,
      name: member.name,
      role: nonEmpty(
        (member.roles ?? [])
          .map((role) => role.character ?? '')
          .filter((name) => name !== '')
          .join(', '),
      ),
      profile: toImageSet(member.profile_path, 'profile'),
      episodeCount: member.total_episode_count ?? null,
    })),
    crew,
    creators: (dto.created_by ?? []).map((creator) => ({
      personId: creator.id,
      name: creator.name,
      job: 'Creator',
      department: 'Writing',
      profile: toImageSet(creator.profile_path, 'profile'),
    })),
    writers: uniqueCrew(crew.filter((member) => member.department === 'Writing')).slice(0, 4),
    collection: null,
    releases: [],
    videos: toVideos(dto.videos?.results),
    watch: toWatchOptions(dto['watch/providers']?.results[region]),
    recommendations: toRecommendations(dto.recommendations?.results, dto.similar?.results, 'tv'),
    show: {
      seasons,
      numberOfSeasons: dto.number_of_seasons ?? seasons.length,
      numberOfEpisodes: dto.number_of_episodes ?? 0,
      networks: (dto.networks ?? []).map(toCompany),
      nextEpisode:
        next === null || next === undefined
          ? null
          : {
              season: next.season_number,
              episode: next.episode_number,
              name: next.name ?? '',
              airDate: nonEmpty(next.air_date),
            },
      lastAirYear: toYear(dto.last_air_date),
    },
  };
};

export const toSeasonDetails = (dto: SeasonDto, showId: number): SeasonDetails => ({
  showId,
  number: dto.season_number,
  name: dto.name ?? '',
  overview: dto.overview ?? '',
  airDate: nonEmpty(dto.air_date),
  poster: toImageSet(dto.poster_path, 'poster'),
  episodes: (dto.episodes ?? []).map((episode) => ({
    number: episode.episode_number,
    name: episode.name ?? '',
    overview: episode.overview ?? '',
    airDate: nonEmpty(episode.air_date),
    runtimeMinutes: episode.runtime ?? null,
    still: toImageSet(episode.still_path, 'still'),
    rating: toRating(episode.vote_average, episode.vote_count),
  })),
});

export const toEpisodeDetails = (dto: EpisodeDto, showId: number): EpisodeDetails => ({
  showId,
  season: dto.season_number,
  number: dto.episode_number,
  name: dto.name ?? '',
  overview: dto.overview ?? '',
  airDate: nonEmpty(dto.air_date),
  runtimeMinutes: dto.runtime ?? null,
  still: toImageSet(dto.still_path, 'still'),
  rating: toRating(dto.vote_average, dto.vote_count),
  voteCount: dto.vote_count ?? 0,
  guestStars: (dto.guest_stars ?? []).map(toCast),
  crew: uniqueCrew((dto.crew ?? []).map(toCrew)),
  stills: toSizedImages(dto.images?.stills, 'galleryBackdrop'),
});

export const toCollection = (dto: CollectionDto): Collection => ({
  id: dto.id,
  name: dto.name,
  overview: dto.overview ?? '',
  poster: toImageSet(dto.poster_path, 'poster'),
  backdrop: toImageSet(dto.backdrop_path, 'backdrop'),
  parts: dto.parts.map((part) => toMediaSummary(part, 'movie')),
});

/** TMDB serves avatars from its image host or, for old accounts, Gravatar ("/https://..."). */
const toAvatar = (path: string | null | undefined): string | null => {
  const value = nonEmpty(path);
  if (value === null) return null;
  return value.startsWith('/http') ? value.slice(1) : (toImageSet(value, 'profile')?.small ?? null);
};

const toReview = (dto: ReviewDto): Review => ({
  id: dto.id,
  author: nonEmpty(dto.author_details?.username) ?? dto.author,
  rating: dto.author_details?.rating ?? null,
  content: dto.content.trim(),
  createdAt: nonEmpty(dto.created_at),
  avatar: toAvatar(dto.author_details?.avatar_path),
  url: dto.url,
});

export const toReviewPage = (dto: ReviewPageDto): Page<Review> => toPage(dto, toReview);
