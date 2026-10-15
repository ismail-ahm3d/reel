import { aMedia } from '@shared/domain/model/media.testing';
import {
  ageOf,
  creditsIn,
  departmentsOf,
  filmography,
  type Credit,
  type PersonDetails,
} from '@features/people/domain/model/personDetails';

const credit = (
  id: number,
  overrides: Partial<Credit> & { readonly year?: number | null; readonly votes?: number } = {},
): Credit => {
  const { year = 2000, votes = 10, ...rest } = overrides;
  return {
    media: aMedia({ id, year, voteCount: votes }),
    role: null,
    department: 'acting',
    crewDepartment: null,
    episodeCount: null,
    popularity: 1,
    ...rest,
  };
};

const person = (credits: readonly Credit[], knownForDepartment = 'Acting'): PersonDetails => ({
  id: 1,
  name: 'Someone',
  biography: '',
  knownForDepartment,
  birthday: null,
  deathday: null,
  placeOfBirth: null,
  profile: null,
  alsoKnownAs: [],
  photos: [],
  links: [],
  credits,
});

describe('filmography', () => {
  it('lists each title once, newest first, with undated titles leading', () => {
    const { timeline } = filmography(
      person([
        credit(1, { year: 1999 }),
        credit(2, { year: null }),
        credit(3, { year: 2010 }),
        credit(1, { year: 1999, department: 'crew' }),
      ]),
    );
    expect(timeline.map((c) => c.media.ref.id)).toEqual([2, 3, 1]);
  });

  it('knows a director for their directing, not their cameos', () => {
    const { knownFor } = filmography(
      person([credit(1, { votes: 9000 }), credit(2, { department: 'crew', votes: 50 })], 'Directing'),
    );
    expect(knownFor.map((media) => media.ref.id)).toEqual([2]);
  });
});

describe('departments', () => {
  it('lists the busiest department first and joins roles per title', () => {
    const someone = person([
      credit(1, { department: 'crew', crewDepartment: 'Directing', role: 'Director' }),
      credit(1, { department: 'crew', crewDepartment: 'Writing', role: 'Screenplay' }),
      credit(2, { department: 'crew', crewDepartment: 'Directing', role: 'Director' }),
      credit(3, { role: 'Himself' }),
    ]);
    expect(departmentsOf(someone)).toEqual(['Directing', 'Writing', 'Acting']);
    expect(creditsIn(someone, 'Directing').map((c) => c.media.ref.id)).toEqual([1, 2]);
  });
});

describe('ageOf', () => {
  it('counts whole years up to the day', () => {
    expect(ageOf('1990-10-16', null, new Date('2026-10-15T12:00:00'))).toBe(35);
    expect(ageOf('1990-10-15', null, new Date('2026-10-15T12:00:00'))).toBe(36);
  });

  it('stops at the day of death', () => {
    expect(ageOf('1950-01-01', '2000-06-01', new Date('2026-10-15'))).toBe(50);
  });
});
