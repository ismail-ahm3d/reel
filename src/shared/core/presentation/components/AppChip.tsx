import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppChipProps = {
  readonly label: string;
  readonly onPress: () => void;
  readonly selected?: boolean;
  readonly icon?: IconName;
  /** onMedia sits over photos and the black stage: translucent when idle, white when selected. */
  readonly tone?: 'plain' | 'onMedia';
};

/** A capsule for filters and scopes. Selected chips invert, like the system's filter pills. */
export const AppChip = ({ label, onPress, selected = false, icon, tone = 'plain' }: AppChipProps) => {
  styles.useVariants({ selected, tone });
  const textColor =
    tone === 'onMedia' ? (selected ? 'stage' : 'onStage') : selected ? 'background' : 'onSurface';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => styles.chip(pressed)}
    >
      {icon !== undefined && <AppIcon name={icon} size="s" color={textColor} />}
      <AppText role="title" scale="small" color={textColor} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  chip: (pressed: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.shape.full,
    opacity: pressed ? 0.7 : 1,
    variants: {
      selected: {
        true: { backgroundColor: theme.colors.onBackground },
        false: { backgroundColor: theme.colors.surface },
      },
      tone: {
        plain: {},
        onMedia: {},
      },
    },
    compoundVariants: [
      { selected: true, tone: 'onMedia', styles: { backgroundColor: theme.colors.onStage } },
      { selected: false, tone: 'onMedia', styles: { backgroundColor: theme.colors.scrim } },
    ],
  }),
}));
