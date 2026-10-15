import type { Translate } from '@shared/core/presentation/i18n/useTranslate';

/** TMDB names its departments in English only; these are the ones it uses. */
const departmentKeys: Readonly<Record<string, string>> = {
  Acting: 'department.acting',
  Directing: 'department.directing',
  Writing: 'department.writing',
  Production: 'department.production',
  Camera: 'department.camera',
  Editing: 'department.editing',
  Sound: 'department.sound',
  Art: 'department.art',
  'Costume & Make-Up': 'department.costume',
  'Visual Effects': 'department.visualEffects',
  Crew: 'department.crew',
  Lighting: 'department.lighting',
  Creator: 'department.creator',
};

/** A department in the app's language; one TMDB adds later shows as TMDB names it. */
export const departmentText = (department: string, t: Translate): string => {
  const key = departmentKeys[department];
  return key === undefined ? department : t({ key });
};
