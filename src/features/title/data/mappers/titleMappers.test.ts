import { movieToDetails, tvToDetails } from '@features/title/data/mappers/titleMappers';

describe('titleMappers', () => {
  it('reads the certification and the providers of the user region', () => {
    const details = movieToDetails(
      {
        id: 550,
        title: 'Fight Club',
        release_date: '1999-10-15',
        runtime: 139,
        release_dates: {
          results: [
            { iso_3166_1: 'DE', release_dates: [{ certification: '18', type: 3 }] },
            {
              iso_3166_1: 'US',
              release_dates: [
                { certification: '', type: 1 },
                { certification: 'R', type: 3 },
              ],
            },
          ],
        },
        'watch/providers': {
          results: {
            US: {
              link: 'https://x',
              rent: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/l.png', display_priority: 1 }],
            },
          },
        },
        credits: {
          cast: [],
          crew: [{ id: 7, name: 'David Fincher', job: 'Director', department: 'Directing' }],
        },
      },
      'US',
      'en',
    );
    expect(details.certification).toBe('R');
    expect(details.watch?.rent.map((provider) => provider.name)).toEqual(['Apple TV']);
    expect(details.creators.map((person) => person.name)).toEqual(['David Fincher']);
    expect(details.runtimeMinutes).toBe(139);
  });

  it('lists a show’s seasons in order with specials last, skipping empty ones', () => {
    const details = tvToDetails(
      {
        id: 1,
        name: 'Show',
        seasons: [
          { season_number: 0, name: 'Specials', episode_count: 2 },
          { season_number: 2, name: 'Season 2', episode_count: 8 },
          { season_number: 1, name: 'Season 1', episode_count: 10 },
          { season_number: 3, name: 'Season 3', episode_count: 0 },
        ],
      },
      'US',
      'en',
    );
    expect(details.show?.seasons.map((season) => season.number)).toEqual([1, 2, 0]);
  });

  it('prefers a logo in the app language, then English, then one without text', () => {
    const logos = [
      { file_path: '/none.png', iso_639_1: null, aspect_ratio: 2, vote_average: 9 },
      { file_path: '/en.png', iso_639_1: 'en', aspect_ratio: 3, vote_average: 5 },
      { file_path: '/ar.png', iso_639_1: 'ar', aspect_ratio: 4, vote_average: 1 },
    ];
    const arabic = movieToDetails({ id: 1, title: 'T', images: { logos } }, 'US', 'ar');
    expect(arabic.logo?.image.small).toContain('/ar.png');
    const english = movieToDetails({ id: 1, title: 'T', images: { logos } }, 'US', 'en');
    expect(english.logo?.image.small).toContain('/en.png');
    expect(english.logo?.aspectRatio).toBe(3);
    expect(movieToDetails({ id: 1, title: 'T' }, 'US', 'en').logo).toBeNull();
  });
});
