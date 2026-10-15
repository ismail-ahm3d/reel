import type { GetPerson } from '@features/people/domain/usecases/getPerson';

export type PeopleUseCases = {
  readonly getPerson: GetPerson;
};
