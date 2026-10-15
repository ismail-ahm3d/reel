import { FlatList, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { MediaRow } from '@shared/presentation/components/MediaRow';
import { PersonCard } from '@shared/presentation/components/PersonCard';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import { searchResultKey, searchScopes } from '@features/search/domain/model/searchResult';
import { GenreGrid } from '@features/search/presentation/screens/search/components/GenreGrid';
import { NamedRow } from '@features/search/presentation/screens/search/components/NamedRow';
import { PersonRow } from '@features/search/presentation/screens/search/components/PersonRow';
import { TrendingList } from '@features/search/presentation/screens/search/components/TrendingList';
import {
  useSearchScreen,
  type SearchScreenProps,
  type SearchView,
} from '@features/search/presentation/screens/search/useSearchScreen';

const Suggestions = ({ view }: { readonly view: SearchView }) => {
  const t = useTranslate();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      style={styles.screen}
      contentContainerStyle={styles.suggestions}
    >
      <TrendingList
        title={t({ key: 'search.trendingNow' })}
        items={view.trending.slice(0, 8)}
        onSelect={view.openMedia}
      />
      {view.people.length > 0 && (
        <View>
          <SectionHeader title={t({ key: 'search.popularPeople' })} />
          <FlatList
            horizontal
            data={view.people}
            keyExtractor={(person) => String(person.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleRail}
            renderItem={({ item }) => (
              <PersonCard
                name={item.name}
                detail={item.knownFor[0] ?? item.department}
                imageUri={item.profile?.small ?? null}
                onPress={() => {
                  view.openPerson(item);
                }}
              />
            )}
          />
        </View>
      )}
      <GenreGrid
        title={t({ key: 'search.browseMovies' })}
        allLabel={t({ key: 'search.allMovies' })}
        genres={view.movieGenres}
        onSelect={(genre) => {
          view.browse('movie', genre);
        }}
        onSelectAll={() => {
          view.browse('movie', null);
        }}
      />
      <GenreGrid
        title={t({ key: 'search.browseTv' })}
        allLabel={t({ key: 'search.allTv' })}
        genres={view.tvGenres}
        onSelect={(genre) => {
          view.browse('tv', genre);
        }}
        onSelectAll={() => {
          view.browse('tv', null);
        }}
      />
    </ScrollView>
  );
};

const Results = ({ view }: { readonly view: SearchView }) => {
  const t = useTranslate();
  return (
    <FlatList
      data={view.results}
      keyExtractor={searchResultKey}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      contentContainerStyle={styles.results}
      onEndReached={view.loadMore}
      onEndReachedThreshold={0.6}
      ListHeaderComponent={
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scopes}
          keyboardShouldPersistTaps="handled"
        >
          {searchScopes.map((scope) => (
            <AppChip
              key={scope}
              label={t({ key: `search.scope.${scope}` })}
              selected={view.scope === scope}
              onPress={() => {
                view.setScope(scope);
              }}
            />
          ))}
        </ScrollView>
      }
      ListEmptyComponent={
        view.isSearching ? (
          <AppLoading variant="inline" />
        ) : (
          <AppEmptyState
            icon={{ ios: 'magnifyingglass', android: 'search' }}
            title={t({ key: 'search.noResultsTitle' })}
            message={t({ key: 'search.noResultsMessage' })}
          />
        )
      }
      ListFooterComponent={view.isLoadingMore ? <AppLoading variant="inline" /> : null}
      renderItem={({ item }) =>
        item.kind === 'media' ? (
          <MediaRow media={item.media} onPress={view.openMedia} />
        ) : item.kind === 'person' ? (
          <PersonRow person={item.person} onPress={view.openPerson} />
        ) : (
          <NamedRow
            item={item.item}
            kind={item.kind}
            kindLabel={t({ key: `search.kind.${item.kind}` })}
            onPress={() => {
              view.openNamed(item);
            }}
          />
        )
      }
    />
  );
};

export const SearchScreen = (props: SearchScreenProps) => {
  const view = useSearchScreen(props);
  if (view.mode === 'idle') return <Suggestions view={view} />;
  if (view.searchError !== null)
    return <AppErrorView text={errorText(view.searchError)} onRetry={view.retrySearch} />;
  return <Results view={view} />;
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  suggestions: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
    gap: theme.spacing.xl,
  },
  peopleRail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
  results: {
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
    flexGrow: 1,
  },
  scopes: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    gap: theme.spacing.s,
  },
}));
