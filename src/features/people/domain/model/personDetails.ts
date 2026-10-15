import type { ExternalLink } from '@shared/domain/model/externalLink';
import type { ImageSet, SizedImage } from '@shared/domain/model/imageSet';
import type { MediaSummary } from '@shared/domain/model/media';

/** One title in a filmography: the work, and what the person did on it. */
export type Credit = {
  readonly media: MediaSummary;
  /** A character for acting, a job for crew; null when TMDB does not say. */
  readonly role: string | null;
  readonly department: 'acting' | 'crew';
  /** For crew credits, the department as TMDB names it: Directing, Writing, Production... */
  readonly crewDepartment: string | null;
  /** Episodes a person appeared in, for shows. */
  readonly episodeCount: number | null;
  readonly popularity: number;
};

export type PersonDetails = {
  readonly id: number;
  readonly name: string;
  readonly biography: string;
  readonly knownForDepartment: string | null;
  readonly birthday: string | null;
  readonly deathday: string | null;
  readonly placeOfBirth: string | null;
  readonly profile: ImageSet | null;
  /** Other names and spellings, often in other scripts. */
  readonly alsoKnownAs: readonly string[];
  readonly photos: readonly SizedImage[];
  readonly links: readonly ExternalLink[];
  readonly credits: readonly Credit[];
};

/** The department filter: acting, or one crew department. */
export type CreditDepartment = string;

export const actingDepartment = 'Acting';

const departmentOf = (credit: Credit): CreditDepartment =>
  credit.department === 'acting' ? actingDepartment : (credit.crewDepartment ?? 'Crew');

/** The departments the person has credits in, the busiest first. */
export const departmentsOf = (person: PersonDetails): readonly CreditDepartment[] => {
  const counts = new Map<CreditDepartment, number>();
  for (const credit of person.credits)
    counts.set(departmentOf(credit), (counts.get(departmentOf(credit)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([department]) => department);
};

/** Credits in one department, each title once with its roles joined, newest first. */
export const creditsIn = (person: PersonDetails, department: CreditDepartment): readonly Credit[] => {
  const byTitle = new Map<string, Credit>();
  for (const credit of person.credits.filter((item) => departmentOf(item) === department)) {
    const key = `${credit.media.ref.type}:${credit.media.ref.id}`;
    const existing = byTitle.get(key);
    const role = [existing?.role, credit.role]
      .filter((part): part is string => part !== null && part !== undefined)
      .join(', ');
    byTitle.set(key, { ...credit, role: role === '' ? null : role });
  }
  return [...byTitle.values()].sort(
    (a, b) => (b.media.year ?? 9999) - (a.media.year ?? 9999) || b.popularity - a.popularity,
  );
};

export type Filmography = {
  /** The most popular titles, for the "Known For" rail. */
  readonly knownFor: readonly MediaSummary[];
  /** Every title once, newest first; undated titles (announced projects) lead. */
  readonly timeline: readonly Credit[];
};

const knownForCount = 12;

/**
 * A person's best-known titles are the most popular credits in their own department, so a
 * director's films come before the talk shows they appeared on.
 */
export const filmography = (person: PersonDetails): Filmography => {
  const department = person.knownForDepartment === 'Acting' ? 'acting' : 'crew';
  const unique = new Map<string, Credit>();
  for (const credit of person.credits) {
    const key = `${credit.media.ref.type}:${credit.media.ref.id}`;
    const existing = unique.get(key);
    if (existing === undefined || (existing.department !== department && credit.department === department))
      unique.set(key, credit);
  }
  const credits = [...unique.values()];
  const knownFor = credits
    .filter(
      (credit) =>
        credit.department === department && credit.media.poster !== null && credit.media.voteCount > 0,
    )
    // Talk shows and award ceremonies have thousands of guests; a role with few episodes there is not "known for".
    .filter(
      (credit) =>
        credit.media.ref.type === 'movie' || (credit.episodeCount ?? 0) > 2 || department === 'crew',
    )
    .sort((a, b) => b.media.voteCount - a.media.voteCount)
    .slice(0, knownForCount)
    .map((credit) => credit.media);
  const timeline = credits.sort(
    (a, b) => (b.media.year ?? 9999) - (a.media.year ?? 9999) || b.popularity - a.popularity,
  );
  return { knownFor, timeline };
};

/** Age in whole years at `on`, or at death. */
export const ageOf = (birthday: string, deathday: string | null, on: Date): number | null => {
  const born = new Date(`${birthday}T00:00:00`);
  const end = deathday === null ? on : new Date(`${deathday}T00:00:00`);
  if (Number.isNaN(born.getTime()) || Number.isNaN(end.getTime())) return null;
  const hadBirthday =
    end.getMonth() > born.getMonth() ||
    (end.getMonth() === born.getMonth() && end.getDate() >= born.getDate());
  return end.getFullYear() - born.getFullYear() - (hadBirthday ? 0 : 1);
};
