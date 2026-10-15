import { SectionList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import {
  useCreditsScreen,
  type CreditsScreenProps,
} from '@features/title/presentation/screens/credits/useCreditsScreen';

export const CreditsScreen = (props: CreditsScreenProps) => {
  const view = useCreditsScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <AppLoading />;

  return (
    <SectionList
      sections={view.sections.map((section) => ({ title: section.department, data: section.people }))}
      keyExtractor={(person) => person.key}
      contentInsetAdjustmentBehavior="automatic"
      stickySectionHeadersEnabled
      style={styles.screen}
      contentContainerStyle={styles.content}
      initialNumToRender={20}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <AppText role="title" scale="small" color="onSurfaceVariant" accessibilityRole="header">
            {(section.title === 'cast' ? t({ key: 'title.cast' }) : section.title).toUpperCase()}
          </AppText>
        </View>
      )}
      renderItem={({ item }) => {
        const episodes =
          item.episodeCount === null
            ? null
            : t({ key: 'title.episodeCount', params: { count: item.episodeCount } });
        const line = [item.detail, episodes].filter((part) => part !== null).join(' · ');
        return (
          <AppPressable
            onPress={() => {
              view.openPerson(item.personId);
            }}
            accessibilityLabel={line === '' ? item.name : `${item.name}, ${line}`}
          >
            <View style={styles.row}>
              <View style={styles.portrait}>
                <AppImage uri={item.profile?.small ?? null} shape="full" style={{ width: 48, height: 48 }} />
                {item.profile === null && (
                  <View style={styles.placeholder}>
                    <AppIcon
                      name={{ ios: 'person.fill', android: 'person' }}
                      size="m"
                      color="onSurfaceVariant"
                    />
                  </View>
                )}
              </View>
              <View style={styles.text}>
                <AppText role="title" scale="medium" numberOfLines={1}>
                  {item.name}
                </AppText>
                {line !== '' && (
                  <AppText role="body" scale="small" color="onSurfaceVariant" numberOfLines={2}>
                    {line}
                  </AppText>
                )}
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', directional: true }}
                size="s"
                color="outline"
              />
            </View>
          </AppPressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
  },
  portrait: {
    width: 48,
    height: 48,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
}));
