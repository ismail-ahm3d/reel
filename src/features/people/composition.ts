import type { HttpClient } from '@shared/core/data/http/httpClient';
import type { PeopleUseCases } from '@features/people/domain/usecases/peopleUseCases';
import { makeGetPerson } from '@features/people/domain/usecases/getPerson';
import { makePersonRemoteDataSource } from '@features/people/data/datasources/remote/personRemoteDataSource';
import { makePersonRepository } from '@features/people/data/repositories/personRepositoryImpl';

export const makePeople = ({ http }: { http: HttpClient }): PeopleUseCases => ({
  getPerson: makeGetPerson({
    people: makePersonRepository({ remote: makePersonRemoteDataSource({ http }) }),
  }),
});
