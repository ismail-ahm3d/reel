import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { PersonSummary } from '@shared/domain/model/person';

export type PersonRowProps = {
  readonly person: PersonSummary;
  readonly onPress: (person: PersonSummary) => void;
};

export const PersonRow = ({ person, onPress }: PersonRowProps) => {
  const line = [person.department, person.knownFor.slice(0, 2).join(', ')]
    .filter((part) => part !== null && part !== '')
    .join(' · ');
  return (
    <AppPressable
      onPress={() => {
        onPress(person);
      }}
      accessibilityLabel={line === '' ? person.name : `${person.name}, ${line}`}
    >
      <View style={styles.row}>
        <View style={styles.portrait}>
          <AppImage uri={person.profile?.small ?? null} shape="full" style={{ width: 56, height: 56 }} />
          {person.profile === null && (
            <View style={styles.placeholder}>
              <AppIcon name={{ ios: 'person.fill', android: 'person' }} size="m" color="onSurfaceVariant" />
            </View>
          )}
        </View>
        <View style={styles.text}>
          <AppText role="title" scale="large" numberOfLines={1}>
            {person.name}
          </AppText>
          {line !== '' && (
            <AppText role="body" scale="small" color="onSurfaceVariant" numberOfLines={2}>
              {line}
            </AppText>
          )}
        </View>
        <AppIcon
          name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
          size="s"
          color="outline"
        />
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
  },
  portrait: {
    width: 56,
    height: 56,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
