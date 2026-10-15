import { useQuery } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import type { SeasonDetails } from '@features/title/domain/model/season';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type SeasonScreenProps = {
  readonly showId: number;
  readonly seasonNumber: number;
  readonly useCases: TitleUseCases;
  readonly onOpenEpisode: (showId: number, seasonNumber: number, episodeNumber: number) => void;
};

export type SeasonView = {
  readonly season: SeasonDetails | null;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly retry: () => void;
  readonly openEpisode: (episodeNumber: number) => void;
};

export const useSeasonScreen = ({
  showId,
  seasonNumber,
  useCases,
  onOpenEpisode,
}: SeasonScreenProps): SeasonView => {
  const season = useQuery({
    queryKey: titleKeys.season(showId, seasonNumber),
    queryFn: async () => getOrThrow(await useCases.getSeason(showId, seasonNumber)),
  });
  return {
    season: season.data ?? null,
    isLoading: season.isPending,
    error: season.error,
    retry: () => void season.refetch(),
    openEpisode: (episodeNumber) => {
      onOpenEpisode(showId, seasonNumber, episodeNumber);
    },
  };
};
