import { I18nManager, type NativeScrollEvent } from 'react-native';
import { scrollPage } from '@shared/core/presentation/mappers/scrollPage';

/** Five 300-wide pages in a 300-wide pager, scrolled to the given offset from the left edge. */
const at = (x: number) =>
  ({
    contentOffset: { x, y: 0 },
    contentSize: { width: 1500, height: 400 },
    layoutMeasurement: { width: 300, height: 400 },
  }) as NativeScrollEvent;

describe('scrollPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('counts pages from the left in left-to-right', () => {
    expect(scrollPage(at(0), 300)).toBe(0);
    expect(scrollPage(at(610), 300)).toBe(2);
  });

  it('counts pages from the right in right-to-left, where the first page sits', () => {
    jest.replaceProperty(I18nManager, 'isRTL', true);
    expect(scrollPage(at(1200), 300)).toBe(0);
    expect(scrollPage(at(900), 300)).toBe(1);
    expect(scrollPage(at(0), 300)).toBe(4);
  });
});
