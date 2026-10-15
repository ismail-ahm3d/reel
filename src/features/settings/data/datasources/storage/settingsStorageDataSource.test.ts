import { makeMemoryStorage } from '@shared/core/data/storage/memoryStorage.fake';
import { makeSettingsStorageDataSource } from '@features/settings/data/datasources/storage/settingsStorageDataSource';

describe('settingsStorageDataSource', () => {
  it('reads settings saved before autoplay existed, with autoplay on', async () => {
    const { storage } = makeMemoryStorage({ 'settings.v1': '{"language":"ar","theme":"dark"}' });
    expect(await makeSettingsStorageDataSource({ storage }).read()).toEqual({
      language: 'ar',
      theme: 'dark',
      autoplayFeatured: true,
    });
  });

  it('keeps autoplay switched off once saved that way', async () => {
    const { storage } = makeMemoryStorage();
    const local = makeSettingsStorageDataSource({ storage });
    await local.write({ language: 'en', theme: 'system', autoplayFeatured: false });
    expect(local.readSync()).toEqual({ language: 'en', theme: 'system', autoplayFeatured: false });
  });
});
