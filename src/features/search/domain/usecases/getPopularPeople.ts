import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { PersonSummary } from '@shared/domain/model/person';
import type { SearchRepository } from '@features/search/domain/repositories/searchRepository';

export type GetPopularPeople = () => Promise<Outcome<readonly PersonSummary[]>>;

/** People with a portrait only: a rail of silhouettes helps nobody. */
export const makeGetPopularPeople =
  ({ search }: { search: SearchRepository }): GetPopularPeople =>
  () =>
    outcome(async () => (await search.popularPeople()).filter((person) => person.profile !== null));
