import type { MediaRef, MediaType } from '@shared/domain/model/media';

/** Every query key of the feature, built here and nowhere else. Signing in or out invalidates them all. */
export const accountKeys = {
  all: ['account'] as const,
  me: ['account', 'me'] as const,
  states: (ref: MediaRef) => ['account', 'states', ref.type, ref.id] as const,
  favorites: (type: MediaType) => ['account', 'favorites', type] as const,
  rated: (type: MediaType) => ['account', 'rated', type] as const,
  recommendations: (type: MediaType) => ['account', 'recommendations', type] as const,
  lists: ['account', 'lists'] as const,
  list: (id: number) => ['account', 'list', id] as const,
};
