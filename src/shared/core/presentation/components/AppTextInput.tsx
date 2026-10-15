import { TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppTextInputProps = {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder?: string;
  readonly multiline?: boolean;
  readonly autoFocus?: boolean;
  readonly maxLength?: number;
  readonly onSubmitEditing?: () => void;
};

/** A labelled field on a grouped surface, with the theme's colours for text, placeholder and caret. */
export const AppTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  autoFocus = false,
  maxLength,
  onSubmitEditing,
}: AppTextInputProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({ multiline });
  return (
    <View style={styles.field}>
      <AppText role="label" scale="large" color="onSurfaceVariant">
        {label.toUpperCase()}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        autoFocus={autoFocus}
        returnKeyType={multiline ? 'default' : 'done'}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        selectionColor={theme.colors.primary}
        {...(placeholder === undefined ? {} : { placeholder })}
        {...(maxLength === undefined ? {} : { maxLength })}
        {...(onSubmitEditing === undefined ? {} : { onSubmitEditing })}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing.s,
  },
  input: {
    ...theme.typography.body.large,
    color: theme.colors.onSurface,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.shape.m,
    backgroundColor: theme.colors.surface,
    variants: {
      multiline: {
        true: { minHeight: theme.spacing.xxxl * 2, textAlignVertical: 'top' },
        false: {},
      },
    },
  },
}));
