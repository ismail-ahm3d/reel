import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { PersonDetails } from '@features/people/domain/model/personDetails';
import type { PersonRepository } from '@features/people/domain/repositories/personRepository';

export type GetPerson = (id: number) => Promise<Outcome<PersonDetails>>;

export const makeGetPerson =
  ({ people }: { people: PersonRepository }): GetPerson =>
  (id) =>
    outcome(() => people.details(id));
