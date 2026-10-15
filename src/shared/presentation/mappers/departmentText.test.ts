import { makeTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { departmentText } from '@shared/presentation/mappers/departmentText';

describe('departmentText', () => {
  it('names TMDB departments in the app language', () => {
    expect(departmentText('Directing', makeTranslate('ar'))).toBe('إخراج');
    expect(departmentText('Costume & Make-Up', makeTranslate('en'))).toBe('Costume & Make-Up');
  });

  it('keeps a department it does not know as TMDB wrote it', () => {
    expect(departmentText('Puppetry', makeTranslate('ar'))).toBe('Puppetry');
  });
});
