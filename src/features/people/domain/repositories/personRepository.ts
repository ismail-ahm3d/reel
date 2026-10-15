import type { PersonDetails } from '@features/people/domain/model/personDetails';

/** Every function may throw AppError; nothing else. */
export type PersonRepository = {
  readonly details: (id: number) => Promise<PersonDetails>;
};
