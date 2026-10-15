import { FlatList, ScrollView, View } from 'react-native';
import { DetailsSkeleton } from '@shared/presentation/components/Skeletons';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppSegmented } from '@shared/core/presentation/components/AppSegmented';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { ExternalLinks } from '@shared/presentation/components/ExternalLinks';
import { ImageRail } from '@shared/presentation/components/ImageRail';
import { MediaRail } from '@shared/presentation/components/MediaRail';
import { MediaRow } from '@shared/presentation/components/MediaRow';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import { departmentText } from '@shared/presentation/mappers/departmentText';
import { PersonHeader } from '@features/people/presentation/screens/person/components/PersonHeader';
import {
  usePersonScreen,
  type CreditFilter,
  type PersonScreenProps,
} from '@features/people/presentation/screens/person/usePersonScreen';

const filters: readonly CreditFilter[] = ['all', 'movie', 'tv'];

export const PersonScreen = (props: PersonScreenProps) => {
  const view = usePersonScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.person === null) return <DetailsSkeleton />;

  const { person } = view;

  return (
    <FlatList
      data={view.credits}
      keyExtractor={(credit) => `${credit.media.ref.type}:${credit.media.ref.id}`}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.screen}
      contentContainerStyle={styles.content}
      initialNumToRender={12}
      ListHeaderComponent={
        <View style={styles.header}>
          <PersonHeader person={person} age={view.age} onShare={view.share} />
          <MediaRail title={t({ key: 'people.knownFor' })} items={view.knownFor} onSelect={view.openMedia} />
          <ImageRail
            title={t({ key: 'people.photos' })}
            images={person.photos}
            height={150}
            onSelect={view.openPhoto}
            onSeeAll={() => {
              view.openPhoto(0);
            }}
            itemLabel={(index) => t({ key: 'gallery.imageLabel', params: { number: index + 1 } })}
          />
          <ExternalLinks links={person.links} onOpen={view.openLink} />
          <View style={styles.creditsHeader}>
            <SectionHeader
              title={t({ key: 'people.credits' })}
              accessory={
                <AppSegmented
                  segments={filters.map((filter) => ({
                    value: filter,
                    label: t({ key: `people.filter.${filter}` }),
                  }))}
                  selected={view.creditFilter}
                  onSelect={view.setCreditFilter}
                />
              }
            />
            {view.departments.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.departments}
              >
                {view.departments.map((department) => (
                  <AppChip
                    key={department}
                    label={departmentText(department, t)}
                    selected={view.department === department}
                    onPress={() => {
                      view.setDepartment(department);
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      }
      ListEmptyComponent={
        <AppEmptyState
          icon={{ ios: 'film', android: 'movie' }}
          title={t({ key: 'people.noCreditsTitle' })}
          message={t({ key: 'people.noCreditsMessage' })}
        />
      }
      renderItem={({ item }) => {
        const kind = t({ key: item.media.ref.type === 'movie' ? 'media.movie' : 'media.tv' });
        const episodes =
          item.episodeCount === null
            ? null
            : t({ key: 'title.episodeCount', params: { count: item.episodeCount } });
        const detail = [
          item.media.year === null ? t({ key: 'people.upcoming' }) : String(item.media.year),
          kind,
          item.role,
          episodes,
        ]
          .filter((part) => part !== null)
          .join(' · ');
        return <MediaRow media={item.media} onPress={view.openMedia} detail={detail} />;
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
  header: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.s,
  },
  creditsHeader: {
    gap: theme.spacing.xs,
  },
  departments: {
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
}));
