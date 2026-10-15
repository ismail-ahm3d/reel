import { pickTrailer, sortVideos, type Video } from '@features/title/domain/model/titleDetails';

const video = (id: string, kind: Video['kind'], official: boolean): Video => ({
  id,
  name: id,
  kind,
  official,
  url: id,
  thumbnail: id,
});

describe('pickTrailer', () => {
  it('prefers an official trailer over an unofficial one and over teasers', () => {
    const videos = [
      video('teaser', 'teaser', true),
      video('fan', 'trailer', false),
      video('official', 'trailer', true),
    ];
    expect(pickTrailer(videos)?.id).toBe('official');
  });

  it('falls back to a teaser, and to nothing when there are only clips', () => {
    expect(pickTrailer([video('clip', 'clip', true), video('teaser', 'teaser', false)])?.id).toBe('teaser');
    expect(pickTrailer([video('clip', 'clip', true)])).toBeNull();
  });

  it('orders the rail trailers first', () => {
    expect(
      sortVideos([video('a', 'featurette', true), video('b', 'trailer', true)]).map((v) => v.id),
    ).toEqual(['b', 'a']);
  });
});
