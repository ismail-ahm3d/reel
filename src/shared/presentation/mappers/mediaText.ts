import type { MediaSummary } from '@shared/domain/model/media';

/** One decimal, the way TMDB shows a score: 7.8. */
export const formatRating = (rating: number): string => rating.toFixed(1);

/** "2h 14m", "48m". */
export const formatRuntime = (
  minutes: number,
): {
  readonly key: 'format.runtimeHours' | 'format.runtimeMinutes';
  readonly params: Readonly<Record<string, number>>;
} =>
  minutes >= 60
    ? { key: 'format.runtimeHours', params: { hours: Math.floor(minutes / 60), minutes: minutes % 60 } }
    : { key: 'format.runtimeMinutes', params: { minutes } };

export const formatMoney = (amount: number, locale?: string): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);

export const formatCount = (count: number, locale?: string): string =>
  new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(count);

/** "May 17, 2024" in the device's own format; null for TMDB's empty dates. */
export const formatDate = (isoDate: string | null, locale?: string): string | null => {
  if (isoDate === null || isoDate === '') return null;
  const date = new Date(`${isoDate}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
};

/** The secondary line of a card: the year, or nothing. */
export const mediaSubtitle = (media: MediaSummary): string => (media.year === null ? '' : String(media.year));

/** "English" for "en" in the device's language; the code itself when the runtime cannot name it. */
export const languageName = (code: string, locale?: string): string =>
  (typeof Intl.DisplayNames === 'function' && /^[a-z]{2,3}$/.test(code)
    ? new Intl.DisplayNames(locale, { type: 'language' }).of(code)
    : undefined) ?? code.toUpperCase();
