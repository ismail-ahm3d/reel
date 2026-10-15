import { useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import type { GallerySource } from '@shared/domain/model/gallerySource';
import type { EpisodeDetails } from '@features/title/domain/model/episode';
import type { CrewMember } from '@features/title/domain/model/titleDetails';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type EpisodeScreenProps = {
  readonly showId: number;
  readonly seasonNumber: number;
  readonly episodeNumber: number;
  readonly useCases: TitleUseCases;
  readonly onOpenPerson: (id: number) => void;
  readonly onOpenGallery: (source: GallerySource, index: number) => void;
};

export type EpisodeView = {
  readonly episode: EpisodeDetails | null;
  /** Directors and writers, the credits an episode page leads with. */
  readonly keyCrew: readonly CrewMember[];
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly openPerson: (id: number) => void;
  readonly openStill: (index: number) => void;
};

const keyJobs = new Set(['Director', 'Writer', 'Teleplay', 'Story', 'Screenplay']);

export const useEpisodeScreen = ({
  showId,
  seasonNumber,
  episodeNumber,
  useCases,
  onOpenPerson,
  onOpenGallery,
}: EpisodeScreenProps): EpisodeView => {
  const episode = useQuery({
    queryKey: titleKeys.episode(showId, seasonNumber, episodeNumber),
    queryFn: async () => getOrThrow(await useCases.getEpisode(showId, seasonNumber, episodeNumber)),
  });
  return {
    episode: episode.data ?? null,
    keyCrew: (episode.data?.crew ?? []).filter((member) => keyJobs.has(member.job)),
    isLoading: episode.isPending,
    error: episode.error,
    retry: () => void episode.refetch(),
    openPerson: onOpenPerson,
    openStill: (index) => {
      onOpenGallery({ kind: 'episode', id: showId, season: seasonNumber, episode: episodeNumber }, index);
    },
  };
};
