import type { BrowseTitles } from '@features/discover/domain/usecases/browseTitles';
import type { GetCategoryPage } from '@features/discover/domain/usecases/getCategoryPage';
import type { GetStreamingServices } from '@features/discover/domain/usecases/getStreamingServices';
import type { GetTitleLogo } from '@features/discover/domain/usecases/getTitleLogo';

export type DiscoverUseCases = {
  readonly getCategoryPage: GetCategoryPage;
  readonly browseTitles: BrowseTitles;
  readonly getStreamingServices: GetStreamingServices;
  readonly getTitleLogo: GetTitleLogo;
};
