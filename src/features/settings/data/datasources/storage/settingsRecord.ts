import { z } from 'zod';

/** How the settings are kept on the device. Version the key when this shape changes. */
export const settingsRecordSchema = z.object({
  language: z.enum(['en', 'ar']),
  theme: z.enum(['system', 'light', 'dark']),
});

export type SettingsRecord = z.infer<typeof settingsRecordSchema>;
