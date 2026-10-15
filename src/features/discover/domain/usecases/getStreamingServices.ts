import { outcome, type Outcome } from '@shared/core/domain/outcome';
import type { MediaType } from '@shared/domain/model/media';
import type { StreamingService } from '@features/discover/domain/model/watchProvider';
import type { DiscoverRepository } from '@features/discover/domain/repositories/discoverRepository';

export type GetStreamingServices = (type: MediaType) => Promise<Outcome<readonly StreamingService[]>>;

/** The services a filter offers: the region's twenty most prominent, enough to cover nearly all viewing. */
export const makeGetStreamingServices =
  ({ discover }: { discover: DiscoverRepository }): GetStreamingServices =>
  (type) =>
    outcome(async () => (await discover.streamingServices(type)).slice(0, 20));
