import { StorageError } from '@shared/core/domain/appError';
import { makeFakeSettingsRepository } from '@features/settings/domain/repositories/settingsRepository.fake';
import { makeGetSettings } from '@features/settings/domain/usecases/getSettings';
import { makeGetStartupSettings } from '@features/settings/domain/usecases/getStartupSettings';
import { makeUpdateSettings } from '@features/settings/domain/usecases/updateSettings';

describe('settings use cases', () => {
  it('starts from the device language and the system appearance', async () => {
    const fake = makeFakeSettingsRepository();
    expect(await makeGetSettings({ settings: fake.repository, deviceLanguageCode: 'ar' })()).toEqual({
      ok: true,
      value: { language: 'ar', theme: 'system', autoplayFeatured: true },
    });
    expect(makeGetStartupSettings({ settings: fake.repository, deviceLanguageCode: 'fr' })()).toEqual({
      language: 'en',
      theme: 'system',
      autoplayFeatured: true,
    });
  });

  it('saves a change over what is stored', async () => {
    const fake = makeFakeSettingsRepository({ language: 'ar', theme: 'system', autoplayFeatured: true });
    const result = await makeUpdateSettings({ settings: fake.repository, deviceLanguageCode: 'en' })({
      theme: 'dark',
    });
    expect(result).toEqual({ ok: true, value: { language: 'ar', theme: 'dark', autoplayFeatured: true } });
    expect(fake.stored()).toEqual({ language: 'ar', theme: 'dark', autoplayFeatured: true });
  });

  it('starts with the defaults when stored settings cannot be read', () => {
    const fake = makeFakeSettingsRepository({ language: 'ar', theme: 'dark', autoplayFeatured: true });
    fake.failWith(new StorageError({ kind: 'corrupt' }));
    expect(makeGetStartupSettings({ settings: fake.repository, deviceLanguageCode: 'en' })()).toEqual({
      language: 'en',
      theme: 'system',
      autoplayFeatured: true,
    });
  });
});
