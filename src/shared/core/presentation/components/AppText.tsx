import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
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

const styles = StyleSheet.create((theme) => ({
  text: (role: keyof BaseTypography, scale: TypeScale, color: keyof BaseColor) => ({
    ...theme.typography[role][scale],
    color: theme.colors[color],
  }),
}));
