import type { SizedImage, ImageSet } from '@shared/domain/model/imageSet';
import type { CastMember, CrewMember } from '@features/title/domain/model/titleDetails';

export type EpisodeDetails = {
  readonly showId: number;
  readonly season: number;
  readonly number: number;
  readonly name: string;
  readonly overview: string;
  readonly airDate: string | null;
  readonly runtimeMinutes: number | null;
  readonly still: ImageSet | null;
  readonly rating: number | null;
  readonly voteCount: number;
  readonly guestStars: readonly CastMember[];
  readonly crew: readonly CrewMember[];
  readonly stills: readonly SizedImage[];
};
