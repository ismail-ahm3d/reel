import { makeTranslate } from '@shared/core/presentation/i18n/useTranslate';

describe('useTranslate', () => {
  const t = makeTranslate('en');

  it('fills parameters', () => {
    expect(t({ key: 'format.runtimeHours', params: { hours: 2, minutes: 14 } })).toBe('2h 14m');
  });

  it('uses the singular form for a count of one', () => {
    expect(t({ key: 'title.seasonCount', params: { count: 1 } })).toBe('1 Season');
    expect(t({ key: 'title.seasonCount', params: { count: 3 } })).toBe('3 Seasons');
  });

  it('translates to Arabic, and returns the key no language has', () => {
    expect(makeTranslate('ar')({ key: 'tabs.movies' })).toBe('الأفلام');
    expect(makeTranslate('ar')({ key: 'nope.key' })).toBe('nope.key');
  });
});
