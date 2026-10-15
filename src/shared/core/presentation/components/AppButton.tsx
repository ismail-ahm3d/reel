import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon, type IconName } from '@shared/core/presentation/components/AppIcon';
import { AppText } from '@shared/core/presentation/components/AppText';

/** Positioning only; how the button looks comes from its variant. */
export type ButtonLayoutStyle = Pick<
  ViewStyle,
  'margin' | 'marginTop' | 'marginBottom' | 'marginHorizontal' | 'marginVertical' | 'alignSelf' | 'flex'
>;

export type AppButtonVariant = 'primary' | 'secondary' | 'text';

export type AppButtonProps = {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: AppButtonVariant;
  readonly icon?: IconName;
  readonly disabled?: boolean;
  readonly accessibilityHint?: string;
  readonly style?: StyleProp<ButtonLayoutStyle>;
};

const contentColor = { primary: 'onPrimary', secondary: 'onSecondary', text: 'primary' } as const;

export const AppButton = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  accessibilityHint,
  style,
}: AppButtonProps) => {
  styles.useVariants({ variant });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...(accessibilityHint === undefined ? {} : { accessibilityHint })}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.container(pressed, disabled), style]}
    >
      <View style={styles.content}>
        {icon !== undefined && <AppIcon name={icon} size="s" color={contentColor[variant]} />}
        <AppText role="title" scale="medium" color={contentColor[variant]} numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: (pressed: boolean, disabled: boolean) => ({
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.shape.l,
    opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primary },
        secondary: { backgroundColor: theme.colors.secondary },
        text: { paddingHorizontal: theme.spacing.s, paddingVertical: theme.spacing.xs },
      },
    },
  }),
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
}));
