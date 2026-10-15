import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { getOrThrow } from '@shared/core/domain/outcome';
import { useDependencies } from '@shell/presentation/dependencies';
import { settingsKeys } from '@features/settings/presentation/queryKeys';

/**
 * Whether a home's featured carousel should move by itself: the user's setting, read through the
 * same query as the Settings screen so a change there applies at once, and only while the
 * screen is the one in view.
 */
export const useAutoplayFeatured = (): boolean => {
  const { settings } = useDependencies();
  const isFocused = useIsFocused();
  const saved = useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => getOrThrow(await settings.getSettings()),
  });
  return isFocused && (saved.data?.autoplayFeatured ?? settings.getStartupSettings().autoplayFeatured);
};
