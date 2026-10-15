import type { GenreRepository } from '@shared/domain/repositories/genreRepository';
import type { GenreRemoteDataSource } from '@shared/data/datasources/remote/genreRemoteDataSource';

export const makeGenreRepository = ({ remote }: { remote: GenreRemoteDataSource }): GenreRepository => ({
  list: async (type) => (await remote.fetch(type)).genres.map(({ id, name }) => ({ id, name })),
});
