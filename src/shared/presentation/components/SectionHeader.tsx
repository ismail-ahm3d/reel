import type { ReactElement } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';

export type SectionHeaderProps = {
  readonly title: string;
  /** Present when the section has more to show: the title becomes a link, like the App Store. */
  readonly onSeeAll?: () => void;
  /** A control at the trailing edge, such as a period switch. */
  readonly accessory?: ReactElement;
};

export const SectionHeader = ({ title, onSeeAll, accessory }: SectionHeaderProps) => {
  const t = useTranslate();
  const heading = (
    <View style={styles.title}>
      <AppText
        role="headline"
        scale="medium"
        accessibilityRole="header"
        numberOfLines={1}
        style={{ flexShrink: 1 }}
      >
        {title}
      </AppText>
      {onSeeAll !== undefined && (
        <AppIcon
          name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
          size="s"
          color="onSurfaceVariant"
        />
      )}
    </View>
  );
  return (
    <View style={styles.header}>
      {onSeeAll === undefined ? (
        heading
      ) : (
        <AppPressable
          onPress={onSeeAll}
          accessibilityLabel={title}
          accessibilityHint={t({ key: 'common.seeAll' })}
          accessibilityRole="link"
          style={{ flex: 1 }}
        >
          {heading}
        </AppPressable>
      )}
      {accessory}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
}));
