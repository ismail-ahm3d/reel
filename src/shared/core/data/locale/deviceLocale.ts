import { getLocales } from 'expo-localization';

export type DeviceLocale = {
  /** BCP 47 tag TMDB understands, such as en-US. */
  readonly language: string;
  /** ISO 3166-1 region, used for release certifications and where-to-watch. */
  readonly region: string;
  /** ISO 639-1 code of the device's first preferred language. */
  readonly languageCode: string;
};

export const readDeviceLocale = (): DeviceLocale => {
  const locale = getLocales()[0];
  const region = locale.regionCode ?? 'US';
  const languageCode = locale.languageCode ?? 'en';
  return { language: `${languageCode}-${region}`, region, languageCode };
};
