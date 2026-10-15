import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppText } from '@shared/core/presentation/components/AppText';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import { formatDate } from '@shared/presentation/mappers/mediaText';
import type { Release } from '@features/title/domain/model/titleDetails';

export type ReleaseListProps = {
  readonly releases: readonly Release[];
};

/** When and how the movie reached the user's region: premiere, cinemas, streaming, disc. */
export const ReleaseList = ({ releases }: ReleaseListProps) => {
  const t = useTranslate();
  const locale = useLocale();
  if (releases.length === 0) return null;
  return (
    <View>
      <SectionHeader title={t({ key: 'title.releaseDates' })} />
      <View style={styles.card}>
        {releases.map((release, index) => (
          <View key={`${release.kind}-${release.date}-${index}`} style={styles.row(index > 0)}>
            <View style={styles.text}>
              <AppText role="body" scale="medium">
                {t({ key: `title.release.${release.kind}` })}
              </AppText>
              {release.note !== null && (
                <AppText role="label" scale="medium" color="onSurfaceVariant" numberOfLines={1}>
                  {release.note}
                </AppText>
              )}
            </View>
            <AppText role="body" scale="medium" color="onSurfaceVariant">
              {[formatDate(release.date, locale), release.certification]
                .filter((part) => part !== null)
                .join(' · ')}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.shape.l,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  row: (separated: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderTopWidth: separated ? theme.border.hairline : theme.border.none,
    borderTopColor: theme.colors.outline,
  }),
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
