import { toExternalLinks, toImageSet, toMediaSummary, toSizedImages } from '@shared/data/mappers/tmdbMappers';
import type { Credit } from '@features/people/domain/model/personDetails';
import type { PersonRepository } from '@features/people/domain/repositories/personRepository';
import type { CreditDto } from '@features/people/data/datasources/remote/personDto';
import type { PersonRemoteDataSource } from '@features/people/data/datasources/remote/personRemoteDataSource';

const nonEmpty = (value: string | null | undefined): string | null =>
  value === null || value === undefined || value.trim() === '' ? null : value;

const toCredit = (dto: CreditDto, department: Credit['department']): Credit => ({
  media: toMediaSummary(dto, dto.media_type === 'tv' ? 'tv' : 'movie'),
  role: nonEmpty(department === 'acting' ? dto.character : dto.job),
  department,
  crewDepartment: department === 'crew' ? nonEmpty(dto.department) : null,
  episodeCount: dto.episode_count ?? null,
  popularity: dto.popularity ?? 0,
});

export const makePersonRepository = ({ remote }: { remote: PersonRemoteDataSource }): PersonRepository => ({
  details: async (id) => {
    const dto = await remote.details(id);
    return {
      id: dto.id,
      name: dto.name,
      biography: dto.biography ?? '',
      knownForDepartment: nonEmpty(dto.known_for_department),
      birthday: nonEmpty(dto.birthday),
      deathday: nonEmpty(dto.deathday),
      placeOfBirth: nonEmpty(dto.place_of_birth),
      profile: toImageSet(dto.profile_path, 'profile'),
      alsoKnownAs: (dto.also_known_as ?? []).filter((name) => name !== dto.name),
      photos: toSizedImages(dto.images?.profiles, 'galleryProfile'),
      links: toExternalLinks(dto.external_ids, nonEmpty(dto.homepage), 'person'),
      credits: [
        ...(dto.combined_credits?.cast ?? []).map((credit) => toCredit(credit, 'acting')),
        ...(dto.combined_credits?.crew ?? []).map((credit) => toCredit(credit, 'crew')),
      ],
    };
  },
});
