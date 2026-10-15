import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppError } from '@shared/core/domain/appError';
import { getOrThrow } from '@shared/core/domain/outcome';
import { selectionFeedback } from '@shared/core/presentation/feedback/haptics';
import type { AppSettings, Language, ThemePreference } from '@features/settings/domain/model/appSettings';
import type { SettingsUseCases } from '@features/settings/domain/usecases/settingsUseCases';
import { settingsKeys } from '@features/settings/presentation/queryKeys';

export type SettingsScreenProps = {
  readonly useCases: SettingsUseCases;
  readonly appVersion: string;
  /** Applies a saved theme to the running app. */
  readonly onThemeChanged: (theme: ThemePreference) => void;
  /** Applies a saved language; resolves false when the app could not restart by itself. */
  readonly onLanguageChanged: (language: Language) => Promise<boolean>;
};

export type SettingsView = {
  readonly settings: AppSettings | null;
  readonly appVersion: string;
  readonly isLoading: boolean;
  readonly error: AppError | null;
  readonly actionError: AppError | null;
  readonly needsRestart: boolean;
  readonly retry: () => void;
  readonly selectLanguage: (language: Language) => void;
  readonly selectTheme: (theme: ThemePreference) => void;
  readonly dismissActionError: () => void;
};

export const useSettingsScreen = ({
  useCases,
  appVersion,
  onThemeChanged,
  onLanguageChanged,
}: SettingsScreenProps): SettingsView => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<AppError | null>(null);
  const [needsRestart, setNeedsRestart] = useState(false);

  const settings = useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => getOrThrow(await useCases.getSettings()),
  });

  const update = useMutation({
    mutationFn: async (change: Partial<AppSettings>) => getOrThrow(await useCases.updateSettings(change)),
    onMutate: () => {
      setActionError(null);
    },
    onSuccess: async (saved, change) => {
      queryClient.setQueryData(settingsKeys.all, saved);
      if (change.theme !== undefined) onThemeChanged(change.theme);
      if (change.language !== undefined) setNeedsRestart(!(await onLanguageChanged(change.language)));
    },
    onError: setActionError,
  });

  const current = settings.data ?? null;

  return {
    settings: current,
    appVersion,
    isLoading: settings.isPending,
    error: settings.error,
    actionError,
    needsRestart,
    retry: () => void settings.refetch(),
    selectLanguage: (language) => {
      if (current?.language === language) return;
      selectionFeedback();
      update.mutate({ language });
    },
    selectTheme: (theme) => {
      if (current?.theme === theme) return;
      selectionFeedback();
      update.mutate({ theme });
    },
    dismissActionError: () => {
      setActionError(null);
    },
  };
};
