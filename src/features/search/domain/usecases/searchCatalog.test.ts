import { makeSearchCatalog } from '@features/search/domain/usecases/searchCatalog';
import type { SearchRepository } from '@features/search/domain/repositories/searchRepository';

const makeRepository = () => {
  const queries: string[] = [];
  const repository: SearchRepository = {
    search: (query) => {
      queries.push(query);
      return Promise.resolve({ items: [], page: 1, totalPages: 1, totalResults: 0 });
    },
    trending: () => Promise.resolve([]),
    popularPeople: () => Promise.resolve([]),
  };
  return { repository, queries };
};

describe('searchCatalog', () => {
  it('does not ask the server about a blank query', async () => {
    const { repository, queries } = makeRepository();
    const result = await makeSearchCatalog({ search: repository })('   ', 'all', 1);
    expect(result).toEqual({ ok: true, value: { items: [], page: 1, totalPages: 1, totalResults: 0 } });
    expect(queries).toEqual([]);
  });

  it('searches the trimmed query', async () => {
    const { repository, queries } = makeRepository();
    await makeSearchCatalog({ search: repository })('  dune ', 'movie', 1);
    expect(queries).toEqual(['dune']);
  });
});
