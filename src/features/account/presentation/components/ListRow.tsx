import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { UserList } from '@features/account/domain/model/account';

export type ListRowProps = {
  readonly list: UserList;
  readonly onPress: (list: UserList) => void;
  /** Shown at the trailing edge instead of the chevron, for pickers. */
  readonly trailing?: 'chevron' | 'add';
};

export const ListRow = ({ list, onPress, trailing = 'chevron' }: ListRowProps) => {
  const t = useTranslate();
  const count = t({ key: 'account.itemCount', params: { count: list.itemCount } });
  return (
    <AppPressable
      onPress={() => {
        onPress(list);
      }}
      accessibilityLabel={`${list.name}, ${count}`}
    >
      <View style={styles.row}>
        <View style={styles.thumb}>
          {list.backdrop === null ? (
            <AppIcon
              name={{ ios: 'list.bullet.rectangle', android: 'list' }}
              size="l"
              color="onSurfaceVariant"
            />
          ) : (
            <AppImage uri={list.backdrop.small} fill />
          )}
        </View>
        <View style={styles.text}>
          <AppText role="title" scale="large" numberOfLines={1}>
            {list.name}
          </AppText>
          <AppText role="body" scale="small" color="onSurfaceVariant" numberOfLines={1}>
            {list.description === '' ? count : `${count} · ${list.description}`}
          </AppText>
        </View>
        {trailing === 'chevron' ? (
          <AppIcon
            name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
            size="s"
            color="outline"
          />
        ) : (
          <AppIcon name={{ ios: 'plus.circle.fill', android: 'add_circle' }} size="m" color="primary" />
        )}
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  thumb: {
    width: 88,
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.shape.s,
    backgroundColor: theme.colors.surfaceVariant,
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
