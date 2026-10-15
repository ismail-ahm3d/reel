import { Fragment, type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppText } from '@shared/core/presentation/components/AppText';

export type SettingsGroupProps = {
  readonly title: string;
  readonly footer?: string;
  readonly children: readonly ReactNode[];
};

/** An inset grouped section, the way the system Settings app draws one. */
export const SettingsGroup = ({ title, footer, children }: SettingsGroupProps) => (
  <View style={styles.group}>
    <View style={styles.caption}>
      <AppText role="label" scale="large" color="onSurfaceVariant" accessibilityRole="header">
        {title.toUpperCase()}
      </AppText>
    </View>
    <View style={styles.card}>
      {children.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={styles.separator} />}
          {child}
        </Fragment>
      ))}
    </View>
    {footer !== undefined && (
      <View style={styles.caption}>
        <AppText role="label" scale="large" color="onSurfaceVariant">
          {footer}
        </AppText>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create((theme) => ({
  group: {
    gap: theme.spacing.s,
  },
  caption: {
    paddingHorizontal: theme.spacing.l,
  },
  card: {
    borderRadius: theme.shape.m,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  separator: {
    height: theme.border.hairline,
    marginStart: theme.spacing.l,
    backgroundColor: theme.colors.outline,
  },
}));
