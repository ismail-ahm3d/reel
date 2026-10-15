import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import { shareLink } from '@shared/core/presentation/feedback/share';
import type { GallerySource } from '@shared/domain/model/gallerySource';
import type { MediaRef, MediaSummary } from '@shared/domain/model/media';
import {
  ageOf,
  creditsIn,
  departmentsOf,
  filmography,
  type Credit,
  type CreditDepartment,
  type PersonDetails,
} from '@features/people/domain/model/personDetails';
import type { PeopleUseCases } from '@features/people/domain/usecases/peopleUseCases';
import { peopleKeys } from '@features/people/presentation/queryKeys';

export type PersonScreenProps = {
  readonly personId: number;
  readonly useCases: PeopleUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  readonly onOpenGallery: (source: GallerySource, index: number) => void;
  readonly onOpenLink: (url: string) => void;
};

export type CreditFilter = 'all' | 'movie' | 'tv';

export type PersonView = {
  readonly person: PersonDetails | null;
  readonly age: number | null;
  readonly knownFor: readonly MediaSummary[];
  readonly departments: readonly CreditDepartment[];
  readonly department: CreditDepartment | null;
  readonly credits: readonly Credit[];
  readonly creditFilter: CreditFilter;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly setCreditFilter: (filter: CreditFilter) => void;
  readonly setDepartment: (department: CreditDepartment) => void;
  readonly openMedia: (media: MediaSummary) => void;
  readonly openPhoto: (index: number) => void;
  readonly openLink: (url: string) => void;
  readonly share: () => void;
};

export const usePersonScreen = ({
  personId,
  useCases,
  onOpenMedia,
  onOpenGallery,
  onOpenLink,
}: PersonScreenProps): PersonView => {
  const [creditFilter, setCreditFilter] = useState<CreditFilter>('all');
  const [chosenDepartment, setChosenDepartment] = useState<CreditDepartment | null>(null);
  const person = useQuery({
    queryKey: peopleKeys.person(personId),
    queryFn: async () => getOrThrow(await useCases.getPerson(personId)),
  });

  const data = person.data;
  const departments = data === undefined ? [] : departmentsOf(data);
  // Until the user picks one, the department the person is known for leads (Acting for actors).
  const known = data?.knownForDepartment ?? null;
  const department =
    chosenDepartment ?? (known !== null && departments.includes(known) ? known : (departments[0] ?? null));
  const birthday = data?.birthday ?? null;

  return {
    person: data ?? null,
    age: birthday === null ? null : ageOf(birthday, data?.deathday ?? null, new Date()),
    knownFor: data === undefined ? [] : filmography(data).knownFor,
    departments,
    department,
    credits: (data === undefined || department === null ? [] : creditsIn(data, department)).filter(
      (credit) => creditFilter === 'all' || credit.media.ref.type === creditFilter,
    ),
    creditFilter,
    isLoading: person.isPending,
    error: person.error,
    retry: () => void person.refetch(),
    setCreditFilter: (filter) => {
      selectionFeedback();
      setCreditFilter(filter);
    },
    setDepartment: (next) => {
      selectionFeedback();
      setChosenDepartment(next);
    },
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    openPhoto: (index) => {
      onOpenGallery({ kind: 'person', id: personId }, index);
    },
    openLink: onOpenLink,
    share: () => {
      if (data !== undefined) shareLink(data.name, `https://www.themoviedb.org/person/${data.id}`);
    },
  };
};
