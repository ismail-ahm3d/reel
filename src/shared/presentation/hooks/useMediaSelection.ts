import { useState } from 'react';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import { mediaRefKey, type MediaSummary } from '@shared/domain/model/media';

export type MediaSelection = {
  readonly isSelecting: boolean;
  /** In the order they were picked. */
  readonly selected: readonly MediaSummary[];
  readonly isSelected: (media: MediaSummary) => boolean;
  /** Enters selection, with the title that was long-pressed already picked. */
  readonly start: (media?: MediaSummary) => void;
  readonly toggle: (media: MediaSummary) => void;
  /** Picks every title shown, or clears them when they are all picked already. */
  readonly toggleAll: (items: readonly MediaSummary[]) => void;
  readonly allSelected: (items: readonly MediaSummary[]) => boolean;
  readonly end: () => void;
};

/** Picking several titles in a grid, the way Photos does: tap to pick, long press to begin. */
export const useMediaSelection = (): MediaSelection => {
  const [isSelecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<readonly MediaSummary[]>([]);
  const keys = new Set(selected.map((media) => mediaRefKey(media.ref)));
  const allSelected = (items: readonly MediaSummary[]) =>
    items.length > 0 && items.every((media) => keys.has(mediaRefKey(media.ref)));
  return {
    isSelecting,
    selected,
    isSelected: (media) => keys.has(mediaRefKey(media.ref)),
    start: (media) => {
      selectionFeedback();
      setSelecting(true);
      setSelected(media === undefined ? [] : [media]);
    },
    toggle: (media) => {
      selectionFeedback();
      const key = mediaRefKey(media.ref);
      setSelected(
        keys.has(key) ? selected.filter((item) => mediaRefKey(item.ref) !== key) : [...selected, media],
      );
    },
    toggleAll: (items) => {
      selectionFeedback();
      setSelected(allSelected(items) ? [] : items);
    },
    allSelected,
    end: () => {
      setSelecting(false);
      setSelected([]);
    },
  };
};
