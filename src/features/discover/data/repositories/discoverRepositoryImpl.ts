import {
  isTitleDto,
  toImageSet,
  toMediaSummary,
  toPage,
  toTitleLogo,
} from '@shared/data/mappers/tmdbMappers';
import type { DiscoverRepository } from '@features/discover/domain/repositories/discoverRepository';
import type { DiscoverRemoteDataSource } from '@features/discover/data/datasources/remote/discoverRemoteDataSource';

export const makeDiscoverRepository = ({
  remote,
  region,
  language,
}: {
  remote: DiscoverRemoteDataSource;
  region: string;
  /** ISO 639-1: the logo language to prefer. */
  language: string;
}): DiscoverRepository => ({
  category: async (type, category, page) => {
    const dto = await remote.category(type, category, page);
    return toPage({ ...dto, results: dto.results.filter(isTitleDto) }, (item) => toMediaSummary(item, type));
  },
  browse: async (type, filters, page) =>
    toPage(await remote.discover(type, filters, page), (item) => toMediaSummary(item, type)),
  streamingServices: async (type) =>
    (await remote.providers(type)).results
      .map((provider) => ({
        id: provider.provider_id,
        name: provider.provider_name,
        logo: toImageSet(provider.logo_path, 'logo'),
        priority: provider.display_priorities?.[region] ?? Number.MAX_SAFE_INTEGER,
      }))
      .sort((a, b) => a.priority - b.priority)
      .map(({ id, name, logo }) => ({ id, name, logo })),
  logo: async (ref) => toTitleLogo(await remote.logos(ref), language),
});
