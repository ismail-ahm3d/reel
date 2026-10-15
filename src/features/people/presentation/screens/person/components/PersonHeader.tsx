import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useLocale, useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIconButton } from '@shared/core/presentation/components/AppIconButton';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppText } from '@shared/core/presentation/components/AppText';
import { formatDate } from '@shared/presentation/mappers/mediaText';
import type { PersonDetails } from '@features/people/domain/model/personDetails';
import { ExpandableText } from '@shared/presentation/components/ExpandableText';

export type PersonHeaderProps = {
  readonly person: PersonDetails;
  readonly age: number | null;
  readonly onShare: () => void;
};

export const PersonHeader = ({ person, age, onShare }: PersonHeaderProps) => {
  const t = useTranslate();
  const locale = useLocale();
  const born = formatDate(person.birthday, locale);
  const died = formatDate(person.deathday, locale);
  const bornLine =
    born === null
      ? null
      : died === null
        ? t({ key: age === null ? 'people.born' : 'people.bornAge', params: { date: born, age: age ?? 0 } })
        : t({ key: 'people.lived', params: { born, died, age: age ?? 0 } });
  return (
    <View style={styles.header}>
      <View style={styles.top}>
        <AppImage
          uri={person.profile?.medium ?? null}
          shape="l"
          style={{ width: 120, aspectRatio: 2 / 3 }}
          accessibilityLabel={person.name}
        />
        <View style={styles.facts}>
          <AppText role="display" scale="small" accessibilityRole="header" selectable>
            {person.name}
          </AppText>
          {person.knownForDepartment !== null && (
            <AppText role="title" scale="medium" color="onSurfaceVariant">
              {person.knownForDepartment}
            </AppText>
          )}
          {bornLine !== null && (
            <AppText role="body" scale="small" color="onSurfaceVariant">
              {bornLine}
            </AppText>
          )}
          {person.placeOfBirth !== null && (
            <AppText role="body" scale="small" color="onSurfaceVariant">
              {person.placeOfBirth}
            </AppText>
          )}
          {person.alsoKnownAs.length > 0 && (
            <AppText role="body" scale="small" color="onSurfaceVariant" numberOfLines={2}>
              {t({
                key: 'people.alsoKnownAs',
                params: { names: person.alsoKnownAs.slice(0, 3).join(' · ') },
              })}
            </AppText>
          )}
          <View style={styles.actions}>
            <AppIconButton
              icon={{ ios: 'square.and.arrow.up', android: 'share' }}
              accessibilityLabel={t({ key: 'common.share' })}
              onPress={onShare}
            />
          </View>
        </View>
      </View>
      {person.biography !== '' && (
        <ExpandableText text={person.biography} moreLabel={t({ key: 'common.more' })} lines={5} />
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
    gap: theme.spacing.l,
  },
  top: {
    flexDirection: 'row',
    gap: theme.spacing.l,
    alignItems: 'flex-end',
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  facts: {
    flex: 1,
    gap: theme.spacing.xs,
  },
}));
