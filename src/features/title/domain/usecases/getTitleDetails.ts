import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import { sortVideos, type TitleDetails } from '@features/title/domain/model/titleDetails';
import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';

export type GetTitleDetails = (ref: MediaRef) => Promise<Outcome<TitleDetails>>;

/** Recommendations without artwork are dropped: a blank card is not a recommendation. */
export const makeGetTitleDetails =
  ({ titles }: { titles: TitleRepository }): GetTitleDetails =>
  (ref) =>
    outcome(async () => {
      const details = await titles.details(ref);
      return {
        ...details,
        videos: sortVideos(details.videos),
        recommendations: details.recommendations.filter((media) => media.poster !== null),
      };
    });
