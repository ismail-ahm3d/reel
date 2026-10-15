import { I18nManager } from 'react-native';

/**
 * iOS 26 lays a large title out glyph by glyph, which breaks Arabic (letters unjoined, in
 * reverse) when the app forces right-to-left on its own; the standard title renders it
 * correctly, so Arabic gets that one.
 */
export const largeTitles = !I18nManager.isRTL;
