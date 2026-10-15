import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaRef, Page } from '@shared/domain/model/media';
import type { Review } from '@features/title/domain/model/titleDetails';
import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';

export type GetReviews = (ref: MediaRef, page: number) => Promise<Outcome<Page<Review>>>;

export const makeGetReviews =
  ({ titles }: { titles: TitleRepository }): GetReviews =>
  (ref, page) =>
    outcome(() => titles.reviews(ref, page));
