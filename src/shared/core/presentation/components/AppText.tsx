import type { ReactNode } from 'react';
import { Platform, Text, type StyleProp, type TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { BaseColor, BaseTypography, TypeScale } from '@shared/core/presentation/theme/contract';

/** Positioning only; how the text looks comes from the role and the scale. */
export type TextLayoutStyle = Pick<
  TextStyle,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'alignSelf'
  | 'flex'
  | 'flexShrink'
  | 'textAlign'
>;

export type AppTextProps = {
  readonly children: ReactNode;
  readonly role?: keyof BaseTypography;
  readonly scale?: TypeScale;
  readonly color?: keyof BaseColor;
  readonly numberOfLines?: number;
  readonly selectable?: boolean;
  readonly accessibilityRole?: 'header' | 'text';
  readonly style?: StyleProp<TextLayoutStyle>;
};

export const AppText = ({
  children,
  role = 'body',
  scale = 'medium',
  color = 'onBackground',
  numberOfLines,
  selectable = false,
  accessibilityRole = 'text',
  style,
}: AppTextProps) => (
  <Text
    accessibilityRole={accessibilityRole}
    selectable={selectable}
    style={[styles.text(role, scale, color), style]}
    {...(numberOfLines === undefined ? {} : { numberOfLines })}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create((theme, rt) => ({
  text: (role: keyof BaseTypography, scale: TypeScale, color: keyof BaseColor) => ({
    ...theme.typography[role][scale],
    // Tracking is tuned for Latin text. Arabic letters join, so spacing them apart is wrong, and
    // Android measures spaced Arabic too narrow and cuts short words off with an ellipsis.
    ...(rt.rtl ? { letterSpacing: 0 } : {}),
    // iOS left-aligns text inside horizontal lists in right-to-left; 'left' means the start edge
    // there (it is swapped in RTL), which puts it back on the right like the rest of the app.
    ...(rt.rtl ? Platform.select({ ios: { textAlign: 'left' as const }, default: {} }) : {}),
    color: theme.colors[color],
  }),
}));
