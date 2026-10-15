import { outcome, type Outcome } from '@shared/core/domain/outcome';
import { sortParts, type Collection } from '@features/title/domain/model/collection';
import type { TitleRepository } from '@features/title/domain/repositories/titleRepository';

export type GetCollection = (id: number) => Promise<Outcome<Collection>>;

export const makeGetCollection =
  ({ titles }: { titles: TitleRepository }): GetCollection =>
  (id) =>
    outcome(async () => {
      const collection = await titles.collection(id);
      return { ...collection, parts: sortParts(collection.parts) };
    });
