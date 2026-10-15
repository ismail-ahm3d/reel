import { Platform, Switch } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export type AppSwitchProps = {
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly accessibilityLabel: string;
  readonly disabled?: boolean;
};

/** The system switch, tinted with the app's primary color when on. */
export const AppSwitch = ({ value, onValueChange, accessibilityLabel, disabled = false }: AppSwitchProps) => {
  const { theme } = useUnistyles();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      trackColor={{ true: theme.colors.primary, false: theme.colors.surfaceVariant }}
      ios_backgroundColor={theme.colors.surfaceVariant}
      // iOS keeps its white knob; Android's is tinted, teal by default.
      thumbColor={Platform.select({
        android: value ? theme.colors.onPrimary : theme.colors.outline,
        default: undefined,
      })}
    />
  );
};
