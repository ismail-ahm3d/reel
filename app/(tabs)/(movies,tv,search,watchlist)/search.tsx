import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { SearchScreen } from '@features/search/presentation/screens/search/SearchScreen';

/** The query lives in the URL, so the native search field and the screen share it without state here. */
export default function SearchRoute() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { search, genres } = useDependencies();
  const t = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'tabs.search' }), headerLargeTitleEnabled: true }} />
      <Stack.SearchBar
        placement="automatic"
        placeholder={t({ key: 'search.placeholder' })}
        autoCapitalize="none"
        hideWhenScrolling={false}
        onChangeText={(event) => {
          router.setParams({ q: event.nativeEvent.text });
        }}
        onCancelButtonPress={() => {
          router.setParams({ q: '' });
        }}
      />
      <SearchScreen
        query={q ?? ''}
        useCases={search}
        genres={genres}
        onOpenMedia={appNavigation.openMedia}
        onOpenPerson={appNavigation.openPerson}
        onBrowse={appNavigation.openGenre}
        onOpenCollection={appNavigation.openCollection}
        onBrowseSource={(source) => {
          appNavigation.openBrowseFrom({ type: 'movie', id: 0 }, source);
        }}
      />
    </>
  );
}
