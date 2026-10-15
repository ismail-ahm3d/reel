import { I18nManager, type NativeScrollEvent } from 'react-native';

/**
 * The page a horizontal pager has settled on. Both platforms report the offset from the
 * content's physical left edge, so in right-to-left, where the first page sits on the right, it
 * is counted from the other end.
 */
export const scrollPage = (event: NativeScrollEvent, interval: number): number => {
  const fromLeft = Math.round(event.contentOffset.x / interval);
  if (!I18nManager.isRTL) return fromLeft;
  const lastOffset = event.contentSize.width - event.layoutMeasurement.width;
  return Math.max(Math.round((lastOffset - event.contentOffset.x) / interval), 0);
};
