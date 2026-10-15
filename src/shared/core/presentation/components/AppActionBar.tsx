import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppAction = {
  readonly label: string;
  readonly icon: IconName;
  readonly onPress: () => void;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
};

export type AppActionBarProps = {
  readonly title: string;
  readonly cancelLabel: string;
  readonly onCancel: () => void;
  readonly toggleAllLabel: string;
  readonly onToggleAll: () => void;
  readonly actions: readonly AppAction[];
};

/**
 * The bar that floats at the bottom while several items are picked, like the Photos selection
 * toolbar. It sits above the tab bar: the safe area of its own view includes it.
 */
export const AppActionBar = ({
  title,
  cancelLabel,
  onCancel,
  toggleAllLabel,
  onToggleAll,
  actions,
}: AppActionBarProps) => (
  <SafeAreaView edges={['bottom']} style={styles.anchor} pointerEvents="box-none">
    <View style={styles.bar}>
      <View style={styles.top}>
        <View style={styles.side}>
          <AppButton
            label={cancelLabel}
            onPress={onCancel}
            variant="text"
            style={{ alignSelf: 'flex-start' }}
          />
        </View>
        <AppText role="title" scale="medium" numberOfLines={1} accessibilityRole="header">
          {title}
        </AppText>
        <View style={styles.side}>
          <AppButton
            label={toggleAllLabel}
            onPress={onToggleAll}
            variant="text"
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
      </View>
      <View style={styles.actions}>
        {actions.map((action) => {
          const color = action.destructive === true ? 'error' : 'primary';
          return (
            <AppPressable
              key={action.label}
              onPress={action.onPress}
              accessibilityLabel={action.label}
              disabled={action.disabled ?? false}
              style={{ flex: 1 }}
            >
              <View style={styles.action}>
                <AppIcon name={action.icon} size="m" color={color} />
                <AppText role="label" scale="medium" color={color} numberOfLines={1}>
                  {action.label}
                </AppText>
              </View>
            </AppPressable>
          );
        })}
      </View>
    </View>
  </SafeAreaView>
);

/** Roughly the bar's height, so a list can keep its last row clear of it. */
export const appActionBarSpace = 140;

const styles = StyleSheet.create((theme) => ({
  anchor: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
  },
  bar: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.xs,
    paddingBottom: theme.spacing.s,
    gap: theme.spacing.xs,
    borderRadius: theme.shape.xxl,
    borderWidth: theme.border.hairline,
    borderColor: theme.colors.outline,
    backgroundColor: theme.colors.surface,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
  },
  side: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    alignItems: 'center',
    gap: theme.spacing.xxs,
    paddingVertical: theme.spacing.xs,
  },
}));
