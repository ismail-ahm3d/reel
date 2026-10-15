import type { Company } from '@shared/domain/model/company';
import type { ExternalLink } from '@shared/domain/model/externalLink';
import type { Genre } from '@shared/domain/model/genre';
import type { ImageSet, SizedImage } from '@shared/domain/model/imageSet';
import type { MediaSummary } from '@shared/domain/model/media';
import type { TitleLogo } from '@shared/domain/model/titleLogo';

export type CastMember = {
  readonly personId: number;
  readonly name: string;
  /** The character, or characters for a long-running show. */
  readonly role: string | null;
  readonly profile: ImageSet | null;
  /** Episodes the actor appears in, for shows. */
  readonly episodeCount: number | null;
};

export type CrewMember = {
  readonly personId: number;
  readonly name: string;
  readonly job: string;
  /** Directing, Writing, Sound... as TMDB groups crew. */
  readonly department: string;
  readonly profile: ImageSet | null;
};

export type VideoKind = 'trailer' | 'teaser' | 'clip' | 'featurette' | 'behindTheScenes' | 'other';

export type Video = {
  readonly id: string;
  readonly name: string;
  readonly kind: VideoKind;
  readonly official: boolean;
  readonly url: string;
  readonly thumbnail: string;
};

export type WatchProvider = {
  readonly id: number;
  readonly name: string;
  readonly logo: ImageSet | null;
};

/** Where the title can be watched in the user's region, per JustWatch through TMDB. */
export type WatchOptions = {
  readonly link: string | null;
  readonly stream: readonly WatchProvider[];
  readonly free: readonly WatchProvider[];
  readonly rent: readonly WatchProvider[];
  readonly buy: readonly WatchProvider[];
};

export type SeasonSummary = {
  readonly number: number;
  readonly name: string;
  readonly episodeCount: number;
  readonly year: number | null;
  readonly poster: ImageSet | null;
};

export type UpcomingEpisode = {
  readonly season: number;
  readonly episode: number;
  readonly name: string;
  readonly airDate: string | null;
};

export type ShowFacts = {
  readonly seasons: readonly SeasonSummary[];
  readonly numberOfSeasons: number;
  readonly numberOfEpisodes: number;
  readonly networks: readonly Company[];
  readonly nextEpisode: UpcomingEpisode | null;
  readonly lastAirYear: number | null;
};

export type Keyword = {
  readonly id: number;
  readonly name: string;
};

export type Review = {
  readonly id: string;
  readonly author: string;
  /** The reviewer's own score out of 10, when they gave one. */
  readonly rating: number | null;
  readonly content: string;
  readonly createdAt: string | null;
  readonly avatar: string | null;
  readonly url: string;
};

/** How a movie reached audiences, per TMDB's release types. */
export type ReleaseKind = 'premiere' | 'limited' | 'theatrical' | 'digital' | 'physical' | 'tv';

export type Release = {
  readonly kind: ReleaseKind;
  /** ISO date. */
  readonly date: string;
  readonly certification: string | null;
  readonly note: string | null;
};

export type CollectionSummary = {
  readonly id: number;
  readonly name: string;
  readonly poster: ImageSet | null;
  readonly backdrop: ImageSet | null;
};

export type TitleDetails = {
  /** The same title as lists know it: what the watchlist saves. */
  readonly summary: MediaSummary;
  readonly logo: TitleLogo | null;
  readonly originalTitle: string;
  readonly tagline: string | null;
  readonly genres: readonly Genre[];
  /** ISO date of the release or the first air date. */
  readonly releaseDate: string | null;
  readonly runtimeMinutes: number | null;
  /** The age rating in the user's region (PG-13, TV-MA...). */
  readonly certification: string | null;
  readonly status: string | null;
  /** ISO 639-1 code. */
  readonly originalLanguage: string | null;
  readonly budget: number | null;
  readonly revenue: number | null;
  readonly homepage: string | null;
  /** Everyone credited for acting, billing order. */
  readonly cast: readonly CastMember[];
  /** Everyone credited off screen. */
  readonly crew: readonly CrewMember[];
  /** Directors for a movie, creators for a show. */
  readonly creators: readonly CrewMember[];
  readonly writers: readonly CrewMember[];
  readonly collection: CollectionSummary | null;
  readonly keywords: readonly Keyword[];
  readonly companies: readonly Company[];
  readonly images: { readonly backdrops: readonly SizedImage[]; readonly posters: readonly SizedImage[] };
  readonly links: readonly ExternalLink[];
  /** Releases in the user's region, oldest first; movies only. */
  readonly releases: readonly Release[];
  readonly videos: readonly Video[];
  readonly watch: WatchOptions | null;
  readonly recommendations: readonly MediaSummary[];
  readonly show: ShowFacts | null;
};

const kindRank: Readonly<Record<VideoKind, number>> = {
  trailer: 0,
  teaser: 1,
  clip: 2,
  featurette: 3,
  behindTheScenes: 4,
  other: 5,
};

/** The video the Trailer button plays: an official trailer first, then any trailer, then a teaser. */
export const pickTrailer = (videos: readonly Video[]): Video | null => {
  const candidates = videos.filter((video) => video.kind === 'trailer' || video.kind === 'teaser');
  const ranked = [...candidates].sort(
    (a, b) => kindRank[a.kind] - kindRank[b.kind] || Number(b.official) - Number(a.official),
  );
  return ranked[0] ?? null;
};

/** Trailers before clips before the rest, so the videos rail leads with what people want. */
export const sortVideos = (videos: readonly Video[]): readonly Video[] =>
  [...videos].sort((a, b) => kindRank[a.kind] - kindRank[b.kind] || Number(b.official) - Number(a.official));
