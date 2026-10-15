import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback, successFeedback } from '@shared/core/presentation/feedback/haptics';
import { shareLink } from '@shared/core/presentation/feedback/share';
import { sameMedia, type MediaRef, type MediaSummary } from '@shared/domain/model/media';
import type { BrowseSource } from '@shared/domain/model/browseSource';
import type { Company } from '@shared/domain/model/company';
import type { GalleryKind } from '@shared/domain/model/gallerySource';
import type { WatchlistUseCases } from '@shared/domain/usecases/sharedUseCases';
import { watchlistKeys } from '@shared/presentation/query/sharedKeys';
import {
  pickTrailer,
  type Keyword,
  type Review,
  type SeasonSummary,
  type TitleDetails,
  type Video,
} from '@features/title/domain/model/titleDetails';
import type { TitleUseCases } from '@features/title/domain/usecases/titleUseCases';
import { tmdbUrl } from '@features/title/presentation/mappers/titleText';
import { titleKeys } from '@features/title/presentation/queryKeys';

export type TitleDetailsScreenProps = {
  readonly mediaRef: MediaRef;
  readonly useCases: TitleUseCases;
  readonly watchlist: WatchlistUseCases;
  readonly onOpenMedia: (ref: MediaRef) => void;
  readonly onOpenPerson: (id: number) => void;
  readonly onOpenSeason: (showId: number, season: SeasonSummary) => void;
  /** Videos open in the YouTube app when it is installed. */
  readonly onPlayVideo: (url: string) => void;
  /** Web pages open in the in-app browser. */
  readonly onOpenLink: (url: string) => void;
  readonly onOpenCredits: (ref: MediaRef) => void;
  readonly onOpenCollection: (id: number) => void;
  readonly onOpenReviews: (ref: MediaRef) => void;
  readonly onOpenGallery: (ref: MediaRef, kind: GalleryKind, index: number) => void;
  readonly onBrowse: (ref: MediaRef, source: BrowseSource) => void;
};

export type TitleDetailsView = {
  readonly details: TitleDetails | null;
  readonly trailer: Video | null;
  /** The first reviews and how many there are; loaded after the page, never blocking it. */
  readonly reviews: readonly Review[];
  readonly reviewCount: number;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly isSaved: boolean;
  readonly isSaving: boolean;
  readonly actionError: AppError | null;
  readonly retry: () => void;
  readonly toggleWatchlist: () => void;
  readonly dismissActionError: () => void;
  readonly playTrailer: () => void;
  readonly playVideo: (video: Video) => void;
  readonly openMedia: (media: MediaSummary) => void;
  readonly openPerson: (id: number) => void;
  readonly openSeason: (season: SeasonSummary) => void;
  readonly openLink: (url: string) => void;
  readonly share: () => void;
  readonly openCredits: () => void;
  readonly openCollection: () => void;
  readonly openReviews: () => void;
  readonly openGallery: (kind: GalleryKind, index: number) => void;
  readonly browseKeyword: (keyword: Keyword) => void;
  readonly browseCompany: (company: Company) => void;
  readonly browseNetwork: (network: Company) => void;
};

export const useTitleDetailsScreen = ({
  mediaRef,
  useCases,
  watchlist,
  onOpenMedia,
  onOpenPerson,
  onOpenSeason,
  onPlayVideo,
  onOpenLink,
  onOpenCredits,
  onOpenCollection,
  onOpenReviews,
  onOpenGallery,
  onBrowse,
}: TitleDetailsScreenProps): TitleDetailsView => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<AppError | null>(null);

  const details = useQuery({
    queryKey: titleKeys.details(mediaRef),
    queryFn: async () => getOrThrow(await useCases.getTitleDetails(mediaRef)),
  });

  const reviews = useQuery({
    queryKey: titleKeys.reviewPreview(mediaRef),
    queryFn: async () => getOrThrow(await useCases.getReviews(mediaRef, 1)),
  });

  const saved = useQuery({
    queryKey: watchlistKeys.all,
    queryFn: async () => getOrThrow(await watchlist.getWatchlist()),
  });

  const toggle = useMutation({
    mutationFn: async (media: MediaSummary) => getOrThrow(await watchlist.toggleWatchlist(media)),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: (isNowSaved) => {
      if (isNowSaved) successFeedback();
      else selectionFeedback();
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
    onError: setActionError,
  });

  const trailer = details.data === undefined ? null : pickTrailer(details.data.videos);

  return {
    details: details.data ?? null,
    trailer,
    reviews: reviews.data?.items ?? [],
    reviewCount: reviews.data?.totalResults ?? 0,
    isLoading: details.isPending,
    error: details.error,
    isSaved: (saved.data ?? []).some((entry) => sameMedia(entry.media.ref, mediaRef)),
    isSaving: toggle.isPending,
    actionError,
    retry: () => void details.refetch(),
    toggleWatchlist: () => {
      if (details.data !== undefined) toggle.mutate(details.data.summary);
    },
    dismissActionError: () => {
      setActionError(null);
    },
    playTrailer: () => {
      if (trailer !== null) onPlayVideo(trailer.url);
    },
    playVideo: (video) => {
      onPlayVideo(video.url);
    },
    openMedia: (media) => {
      onOpenMedia(media.ref);
    },
    openPerson: onOpenPerson,
    openSeason: (season) => {
      onOpenSeason(mediaRef.id, season);
    },
    openLink: onOpenLink,
    share: () => {
      if (details.data !== undefined) shareLink(details.data.summary.title, tmdbUrl(details.data));
    },
    openCredits: () => {
      onOpenCredits(mediaRef);
    },
    openCollection: () => {
      const collection = details.data?.collection ?? null;
      if (collection !== null) onOpenCollection(collection.id);
    },
    openReviews: () => {
      onOpenReviews(mediaRef);
    },
    openGallery: (kind, index) => {
      onOpenGallery(mediaRef, kind, index);
    },
    browseKeyword: (keyword) => {
      onBrowse(mediaRef, { kind: 'keyword', id: keyword.id, name: keyword.name });
    },
    browseCompany: (company) => {
      onBrowse(mediaRef, { kind: 'company', id: company.id, name: company.name });
    },
    browseNetwork: (network) => {
      onBrowse(mediaRef, { kind: 'network', id: network.id, name: network.name });
    },
  };
};
