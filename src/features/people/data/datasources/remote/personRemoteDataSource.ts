import type { HttpClient } from '@shared/core/data/http/httpClient';
import { remoteOutcome } from '@shared/core/data/remoteOutcome';
import {
  personDetailsDtoSchema,
  type PersonDetailsDto,
} from '@features/people/data/datasources/remote/personDto';

/** Every function may throw AppError; nothing else. */
export type PersonRemoteDataSource = {
  readonly details: (id: number) => Promise<PersonDetailsDto>;
};

export const makePersonRemoteDataSource = ({ http }: { http: HttpClient }): PersonRemoteDataSource => ({
  details: (id) =>
    remoteOutcome(async () =>
      personDetailsDtoSchema.parse(
        await http.get(`person/${id}`, { append_to_response: 'combined_credits,external_ids,images' }),
      ),
    ),
});
