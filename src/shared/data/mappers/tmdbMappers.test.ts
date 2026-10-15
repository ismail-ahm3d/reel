import {
  isTitleDto,
  toImageSet,
  toMediaSummary,
  toPage,
  toRating,
  toTitleLogo,
  toYear,
} from '@shared/data/mappers/tmdbMappers';

describe('tmdbMappers', () => {
  it('reads the year from a date and treats an empty date as unknown', () => {
    expect(toYear('2024-05-17')).toBe(2024);
    expect(toYear('')).toBeNull();
    expect(toYear(null)).toBeNull();
  });

  it('has no rating until someone has voted', () => {
    expect(toRating(7.456, 120)).toBe(7.5);
    expect(toRating(0, 0)).toBeNull();
  });

  it('builds an image set from a path, and nothing from a missing one', () => {
    expect(toImageSet('/a.jpg', 'poster')).toEqual({
      small: 'https://image.tmdb.org/t/p/w185/a.jpg',
      medium: 'https://image.tmdb.org/t/p/w342/a.jpg',
      large: 'https://image.tmdb.org/t/p/w780/a.jpg',
    });
    expect(toImageSet(null, 'poster')).toBeNull();
  });

  it('maps a show from a mixed list using its own media type', () => {
    const media = toMediaSummary(
      { id: 7, media_type: 'tv', name: 'Show', first_air_date: '2010-01-01', vote_average: 8, vote_count: 3 },
      'movie',
    );
    expect(media.ref).toEqual({ type: 'tv', id: 7 });
    expect(media.title).toBe('Show');
    expect(media.year).toBe(2010);
  });

  it('keeps titles and drops people from a mixed list', () => {
    expect(isTitleDto({ id: 1, media_type: 'person' })).toBe(false);
    expect(isTitleDto({ id: 1, media_type: 'movie' })).toBe(true);
    expect(isTitleDto({ id: 1 })).toBe(true);
  });

  it('caps the page count at the 500 pages TMDB serves', () => {
    const page = toPage({ page: 1, results: [1], total_pages: 900, total_results: 18000 }, (n) => n * 2);
    expect(page).toEqual({ items: [2], page: 1, totalPages: 500, totalResults: 18000 });
  });
});

describe('toTitleLogo', () => {
  const logo = (iso: string | null, votes: number) => ({
    file_path: `/${iso ?? 'none'}-${votes}.png`,
    aspect_ratio: 4,
    iso_639_1: iso,
    vote_average: votes,
  });

  it('prefers the app language, then English, then a logo without text language', () => {
    expect(toTitleLogo([logo(null, 9), logo('en', 5), logo('ar', 1)], 'ar')?.image.large).toContain(
      '/ar-1.png',
    );
    expect(toTitleLogo([logo(null, 9), logo('en', 5), logo('fr', 9)], 'ar')?.image.large).toContain(
      '/en-5.png',
    );
    expect(toTitleLogo([logo('fr', 9), logo(null, 2)], 'ar')?.image.large).toContain('/none-2.png');
  });

  it('is null when TMDB has no logo', () => {
    expect(toTitleLogo([], 'en')).toBeNull();
    expect(toTitleLogo(null, 'en')).toBeNull();
  });
});
