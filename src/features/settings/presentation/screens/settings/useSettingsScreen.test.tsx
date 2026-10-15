import { act, renderHook, waitFor } from '@testing-library/react-native';
import { makeQueryWrapper } from '@shared/core/presentation/query/queryClient.testing';
import { makeFakeSettingsRepository } from '@features/settings/domain/repositories/settingsRepository.fake';
import { makeGetSettings } from '@features/settings/domain/usecases/getSettings';
import { makeGetStartupSettings } from '@features/settings/domain/usecases/getStartupSettings';
import { makeUpdateSettings } from '@features/settings/domain/usecases/updateSettings';
import { useSettingsScreen } from '@features/settings/presentation/screens/settings/useSettingsScreen';

const setup = async ({ restarts }: { restarts: boolean }) => {
  const fake = makeFakeSettingsRepository({ language: 'en', theme: 'system' });
  const deps = { settings: fake.repository, deviceLanguageCode: 'en' };
  const onThemeChanged = jest.fn();
  const onLanguageChanged = jest.fn(() => Promise.resolve(restarts));
  const { wrapper } = makeQueryWrapper();
  const hook = await renderHook(
    () =>
      useSettingsScreen({
        useCases: {
          getSettings: makeGetSettings(deps),
          getStartupSettings: makeGetStartupSettings(deps),
          updateSettings: makeUpdateSettings(deps),
        },
        appVersion: '1.0.0',
        onThemeChanged,
        onLanguageChanged,
      }),
    { wrapper },
  );
  await waitFor(() => {
    expect(hook.result.current.settings).not.toBeNull();
  });
  return { ...hook, fake, onThemeChanged, onLanguageChanged };
};

describe('useSettingsScreen', () => {
  it('saves and applies a theme', async () => {
    const { result, fake, onThemeChanged } = await setup({ restarts: true });
    await act(() => {
      result.current.selectTheme('dark');
    });
    await waitFor(() => {
      expect(onThemeChanged).toHaveBeenCalledWith('dark');
    });
    expect(fake.stored()?.theme).toBe('dark');
    expect(result.current.settings?.theme).toBe('dark');
  });

  it('asks the user to reopen the app when it cannot restart itself', async () => {
    const { result, onLanguageChanged } = await setup({ restarts: false });
    await act(() => {
      result.current.selectLanguage('ar');
    });
    await waitFor(() => {
      expect(result.current.needsRestart).toBe(true);
    });
    expect(onLanguageChanged).toHaveBeenCalledWith('ar');
  });

  it('does nothing when the current choice is picked again', async () => {
    const { result, onThemeChanged } = await setup({ restarts: true });
    await act(() => {
      result.current.selectTheme('system');
    });
    expect(onThemeChanged).not.toHaveBeenCalled();
  });
});
