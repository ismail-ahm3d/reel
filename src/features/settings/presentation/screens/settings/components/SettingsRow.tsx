import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppSwitch } from '@shared/core/presentation/components/AppSwitch';
import { AppText } from '@shared/core/presentation/components/AppText';

export type SettingsRowProps = {
  readonly label: string;
  /** A trailing value, for rows that only show information. */
  readonly value?: string;
  /** Present on choice rows: the row is pressable and shows a check when selected. */
  readonly selected?: boolean;
  readonly onPress?: () => void;
  /** Present on on/off rows: a switch at the trailing edge. */
  readonly toggle?: { readonly on: boolean; readonly onChange: (on: boolean) => void };
};

export const SettingsRow = ({ label, value, selected, onPress, toggle }: SettingsRowProps) => {
  const content = (
    <View style={styles.row}>
      <AppText role="body" scale="large" style={{ flex: 1 }}>
        {label}
      </AppText>
      {value !== undefined && (
        <AppText role="body" scale="large" color="onSurfaceVariant">
          {value}
        </AppText>
      )}
      {toggle !== undefined && (
        <AppSwitch value={toggle.on} onValueChange={toggle.onChange} accessibilityLabel={label} />
      )}
      {selected === true && (
        <AppIcon name={{ ios: 'checkmark', android: 'check' }} size="m" color="primary" />
      )}
    </View>
  );
  if (onPress === undefined) return content;
  return (
    <AppPressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      selected={selected ?? false}
    >
      {content}
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    minHeight: theme.spacing.xxxl - theme.spacing.xxs,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
}));
