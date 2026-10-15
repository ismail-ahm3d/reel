import { z } from 'zod';

/**
 * How the settings are kept on the device. Version the key when this shape changes in a way old
 * records cannot be read as; a new field with a default is read from them as is.
 */
export const settingsRecordSchema = z.object({
  language: z.enum(['en', 'ar']),
  theme: z.enum(['system', 'light', 'dark']),
  /** Added after the first release: records without it autoplay, as the default does. */
  autoplayFeatured: z.boolean().default(true),
});

export type SettingsRecord = z.infer<typeof settingsRecordSchema>;
