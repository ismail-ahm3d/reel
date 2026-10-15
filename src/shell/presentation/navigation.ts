import { router } from 'expo-router';
import type { BrowseSource } from '@shared/domain/model/browseSource';
import type { GalleryKind, GallerySource } from '@shared/domain/model/gallerySource';
import type { Genre } from '@shared/domain/model/genre';
import type { MediaRef, MediaType } from '@shared/domain/model/media';
import type { Category } from '@features/discover/domain/model/category';

const browse = (type: MediaType, source: BrowseSource | null) => {
  router.push({
    pathname: '/browse/[type]',
    params:
      source === null
        ? { type }
        : { type, source: source.kind, sourceId: String(source.id), title: source.name },
  });
};

/**
 * The app's destinations as callbacks, built once for the route files. Pushing keeps the
 * current tab's stack, so a title opened from Search stays in the Search tab.
 */
export const appNavigation = {
  openMedia: (ref: MediaRef) => {
    if (ref.type === 'movie') router.push({ pathname: '/movie/[id]', params: { id: String(ref.id) } });
    else router.push({ pathname: '/tv/[id]', params: { id: String(ref.id) } });
  },
  openPerson: (id: number) => {
    router.push({ pathname: '/person/[id]', params: { id: String(id) } });
  },
  openCategory: (type: MediaType, category: Category) => {
    router.push({ pathname: '/category/[type]/[category]', params: { type, category } });
  },
  /** From a genre capsule or tile; null browses everything of the type. */
  openGenre: (type: MediaType, genre: Genre | null) => {
    browse(type, genre === null ? null : { kind: 'genre', id: genre.id, name: genre.name });
  },
  /** From a title's keyword, studio or network: networks only make shows, the rest follow the title. */
  openBrowseFrom: (ref: MediaRef, source: BrowseSource) => {
    browse(source.kind === 'network' ? 'tv' : ref.type, source);
  },
  openList: (list: { readonly id: number; readonly name: string }) => {
    router.push({ pathname: '/list/[id]', params: { id: String(list.id), name: list.name } });
  },
  openSettings: () => {
    router.push('/settings');
  },
  closeModal: () => {
    router.back();
  },
  openSeason: (showId: number, season: { readonly number: number; readonly name: string }) => {
    router.push({
      pathname: '/tv/[id]/season/[number]',
      params: { id: String(showId), number: String(season.number), name: season.name },
    });
  },
  openEpisode: (showId: number, seasonNumber: number, episodeNumber: number) => {
    router.push({
      pathname: '/tv/[id]/season/[number]/episode/[episode]',
      params: { id: String(showId), number: String(seasonNumber), episode: String(episodeNumber) },
    });
  },
  openCredits: (ref: MediaRef) => {
    router.push({ pathname: '/credits/[type]/[id]', params: { type: ref.type, id: String(ref.id) } });
  },
  openCollection: (id: number) => {
    router.push({ pathname: '/collection/[id]', params: { id: String(id) } });
  },
  openReviews: (ref: MediaRef) => {
    router.push({ pathname: '/reviews/[type]/[id]', params: { type: ref.type, id: String(ref.id) } });
  },
  /** The photo viewer opens full screen over the tabs. */
  openGallery: (source: GallerySource, kind: GalleryKind, index: number) => {
    router.push({
      pathname: '/gallery',
      params: {
        source: source.kind,
        id: String(source.id),
        ...(source.kind === 'episode'
          ? { season: String(source.season), episode: String(source.episode) }
          : {}),
        kind,
        index: String(index),
      },
    });
  },
};
