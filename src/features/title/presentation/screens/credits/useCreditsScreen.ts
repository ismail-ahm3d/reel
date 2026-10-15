import { useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import type { MediaRef } from '@shared/domain/model/media';
import type { CastMember, CrewMember } from '@features/title/domain/model/titleDetails';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type CreditsScreenProps = {
  readonly mediaRef: MediaRef;
  readonly useCases: TitleUseCases;
  readonly onOpenPerson: (id: number) => void;
};

export type CreditPerson = {
  readonly key: string;
  readonly personId: number;
  readonly name: string;
  readonly detail: string | null;
  readonly profile: CastMember['profile'];
  readonly episodeCount: number | null;
};

export type CreditSection = {
  /** "cast", or a crew department as TMDB names it. */
  readonly department: string;
  readonly people: readonly CreditPerson[];
};

export type CreditsView = {
  readonly sections: readonly CreditSection[];
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly openPerson: (id: number) => void;
};

/** Departments in the order film credits run; any other department follows alphabetically. */
const departmentOrder = [
  'Directing',
  'Writing',
  'Production',
  'Camera',
  'Editing',
  'Sound',
  'Art',
  'Costume & Make-Up',
  'Visual Effects',
  'Crew',
  'Lighting',
];

/** One row per person per department, their jobs joined: "Producer, Screenplay". */
const groupCrew = (crew: readonly CrewMember[]): readonly CreditSection[] => {
  const byDepartment = new Map<string, Map<number, CreditPerson>>();
  for (const member of crew) {
    const department = member.department === '' ? 'Crew' : member.department;
    const people = byDepartment.get(department) ?? new Map<number, CreditPerson>();
    const existing = people.get(member.personId);
    const jobs =
      existing?.detail === null || existing === undefined ? member.job : `${existing.detail}, ${member.job}`;
    people.set(member.personId, {
      key: `${department}-${member.personId}`,
      personId: member.personId,
      name: member.name,
      detail: jobs === '' ? null : jobs,
      profile: member.profile,
      episodeCount: null,
    });
    byDepartment.set(department, people);
  }
  const rank = (department: string) => {
    const index = departmentOrder.indexOf(department);
    return index === -1 ? departmentOrder.length : index;
  };
  return [...byDepartment.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([department, people]) => ({ department, people: [...people.values()] }));
};

/** Reads the same cached details as the title page: the full lists come with it. */
export const useCreditsScreen = ({ mediaRef, useCases, onOpenPerson }: CreditsScreenProps): CreditsView => {
  const details = useQuery({
    queryKey: titleKeys.details(mediaRef),
    queryFn: async () => getOrThrow(await useCases.getTitleDetails(mediaRef)),
  });
  const cast: CreditSection = {
    department: 'cast',
    people: (details.data?.cast ?? []).map((member, index) => ({
      key: `cast-${member.personId}-${index}`,
      personId: member.personId,
      name: member.name,
      detail: member.role,
      profile: member.profile,
      episodeCount: member.episodeCount,
    })),
  };
  return {
    sections:
      details.data === undefined
        ? []
        : [cast, ...groupCrew(details.data.crew)].filter((section) => section.people.length > 0),
    isLoading: details.isPending,
    error: details.error,
    retry: () => void details.refetch(),
    openPerson: onOpenPerson,
  };
};
