import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppScrim } from '@shared/core/presentation/components/AppScrim';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { CollectionSummary } from '@features/title/domain/model/titleDetails';

export type CollectionCardProps = {
  readonly collection: CollectionSummary;
  readonly onPress: () => void;
};

/** "Part of the … Collection": a wide banner leading to the whole series. */
export const CollectionCard = ({ collection, onPress }: CollectionCardProps) => {
  const t = useTranslate();
  return (
    <AppPressable
      feedback="scale"
      onPress={onPress}
      accessibilityLabel={collection.name}
      accessibilityRole="link"
    >
      <View style={styles.card}>
        <AppImage uri={collection.backdrop?.medium ?? collection.poster?.medium ?? null} fill />
        <AppScrim />
        <View style={styles.caption}>
          <View style={styles.text}>
            <AppText role="label" scale="small" color="onScrim">
              {t({ key: 'title.partOf' }).toUpperCase()}
            </AppText>
            <AppText role="headline" scale="small" color="onScrim" numberOfLines={2}>
              {collection.name}
            </AppText>
          </View>
          <AppIcon
            name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
            size="m"
            color="onScrim"
          />
        </View>
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing.l,
    aspectRatio: 2.4,
    borderRadius: theme.shape.l,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.surfaceVariant,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.s,
    padding: theme.spacing.l,
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
