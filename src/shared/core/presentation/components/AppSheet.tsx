import type { ReactNode } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppText } from '@shared/core/presentation/components/AppText';

export type AppSheetProps = {
  readonly visible: boolean;
  readonly title: string;
  readonly doneLabel: string;
  readonly onDone: () => void;
  readonly secondaryLabel?: string;
  readonly onSecondary?: () => void;
  readonly children: ReactNode;
};

/** The system page sheet: swipe down or Done to close, an optional leading action. */
export const AppSheet = ({
  visible,
  title,
  doneLabel,
  onDone,
  secondaryLabel,
  onSecondary,
  children,
}: AppSheetProps) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onDone}>
    <View style={styles.sheet}>
      <View style={styles.bar}>
        <View style={styles.side}>
          {secondaryLabel !== undefined && onSecondary !== undefined && (
            <AppButton
              label={secondaryLabel}
              onPress={onSecondary}
              variant="text"
              style={{ alignSelf: 'flex-start' }}
            />
          )}
        </View>
        <AppText role="title" scale="large" accessibilityRole="header" numberOfLines={1}>
          {title}
        </AppText>
        <View style={styles.side}>
          <AppButton label={doneLabel} onPress={onDone} variant="text" style={{ alignSelf: 'flex-end' }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </View>
  </Modal>
);

const styles = StyleSheet.create((theme, rt) => ({
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: theme.border.hairline,
    borderBottomColor: theme.colors.outline,
  },
  side: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.l,
    gap: theme.spacing.xl,
    paddingBottom: rt.insets.bottom + theme.spacing.xxl,
  },
}));
