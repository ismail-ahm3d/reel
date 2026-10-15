import { toImageSet, toMediaSummary } from '@shared/data/mappers/tmdbMappers';
import type { MediaType } from '@shared/domain/model/media';
import type { Account, AccountStates, RatedTitle, UserList } from '@features/account/domain/model/account';
import type {
  AccountDto,
  AccountStatesDto,
  ListDto,
  RatedItemDto,
} from '@features/account/data/datasources/remote/accountDto';

/** The TMDB avatar if the user uploaded one, else their Gravatar. */
export const toAccount = (dto: AccountDto): Account => {
  const tmdb = dto.avatar?.tmdb?.avatar_path ?? null;
  const gravatar = dto.avatar?.gravatar?.hash ?? null;
  return {
    id: dto.id,
    username: dto.username,
    name: dto.name === undefined || dto.name === null || dto.name.trim() === '' ? null : dto.name,
    avatar:
      tmdb !== null
        ? (toImageSet(tmdb, 'profile')?.small ?? null)
        : gravatar !== null && gravatar !== ''
          ? `https://www.gravatar.com/avatar/${gravatar}?s=200&d=404`
          : null,
  };
};

export const toAccountStates = (dto: AccountStatesDto): AccountStates => ({
  favorite: dto.favorite,
  watchlist: dto.watchlist,
  rating: typeof dto.rated === 'boolean' ? null : dto.rated.value,
});

export const toRatedTitle = (dto: RatedItemDto, type: MediaType): RatedTitle => ({
  media: toMediaSummary(dto, type),
  rating: dto.rating,
});

export const toUserList = (dto: ListDto): UserList => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? '',
  itemCount: dto.number_of_items ?? 0,
  isPublic: dto.public === true || dto.public === 1,
  backdrop: toImageSet(dto.backdrop_path, 'backdrop'),
});
