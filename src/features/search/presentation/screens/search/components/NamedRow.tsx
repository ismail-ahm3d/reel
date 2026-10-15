import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { NamedResult } from '@features/search/domain/model/searchResult';

export type NamedRowProps = {
  readonly item: NamedResult;
  readonly kind: 'collection' | 'company' | 'keyword';
  readonly kindLabel: string;
  readonly onPress: () => void;
};

const icons: Readonly<Record<NamedRowProps['kind'], IconName>> = {
  collection: { ios: 'square.stack', android: 'video_library' },
  company: { ios: 'building.2', android: 'business' },
  keyword: { ios: 'number', android: 'tag' },
};

/** A series, studio or keyword: its picture or symbol, its name and what it is. */
export const NamedRow = ({ item, kind, kindLabel, onPress }: NamedRowProps) => (
  <AppPressable onPress={onPress} accessibilityLabel={`${item.name}, ${kindLabel}`}>
    <View style={styles.row}>
      <View style={styles.thumb(kind === 'company')}>
        {item.image === null ? (
          <AppIcon name={icons[kind]} size="m" color="onSurfaceVariant" />
        ) : (
          <AppImage
            uri={item.image.small}
            fit={kind === 'company' ? 'contain' : 'cover'}
            transparent={kind === 'company'}
            fill
          />
        )}
      </View>
      <View style={styles.text}>
        <AppText role="title" scale="large" numberOfLines={2}>
          {item.name}
        </AppText>
        <AppText role="body" scale="small" color="onSurfaceVariant">
          {kindLabel}
        </AppText>
      </View>
      <AppIcon
        name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
        size="s"
        color="outline"
      />
    </View>
  </AppPressable>
);

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
  },
  thumb: (logo: boolean) => ({
    width: 88,
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: logo ? theme.spacing.xs : theme.spacing.none,
    borderRadius: theme.shape.s,
    backgroundColor: logo ? theme.colors.onScrim : theme.colors.surfaceVariant,
  }),
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
