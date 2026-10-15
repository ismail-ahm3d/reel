import { FlatList, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import {
  AppActionBar,
  appActionBarSpace,
  type AppAction,
} from '@shared/core/presentation/components/AppActionBar';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppSegmented } from '@shared/core/presentation/components/AppSegmented';
import { AppText } from '@shared/core/presentation/components/AppText';
import { MediaGrid } from '@shared/presentation/components/MediaGrid';
import { MediaRail } from '@shared/presentation/components/MediaRail';
import { formatRating } from '@shared/presentation/mappers/mediaText';
import type { IconName } from '@shared/core/presentation/components/AppIcon';
import { AccountAvatar } from '@features/account/presentation/components/AccountAvatar';
import { CreateListSheet } from '@features/account/presentation/components/CreateListSheet';
import { ListPickerSheet } from '@features/account/presentation/components/ListPickerSheet';
import { ListRow } from '@features/account/presentation/components/ListRow';
import { SignInCard } from '@features/account/presentation/components/SignInCard';
import { accountErrorText } from '@features/account/presentation/mappers/accountErrorText';
import {
  useLibraryScreen,
  type BulkAction,
  type LibraryScreenProps,
  type LibrarySection,
  type LibraryView,
} from '@features/account/presentation/screens/library/useLibraryScreen';

const sections: readonly LibrarySection[] = ['watchlist', 'favorites', 'rated', 'lists'];

const emptyIcons: Readonly<Record<LibrarySection, IconName>> = {
  watchlist: { ios: 'bookmark', android: 'bookmark' },
  favorites: { ios: 'heart', android: 'favorite' },
  rated: { ios: 'star', android: 'star' },
  lists: { ios: 'list.bullet.rectangle', android: 'list' },
};

/** Profile, sections and filters: the header above whichever list the section shows. */
const Header = ({ view }: { readonly view: LibraryView }) => {
  const t = useTranslate();
  return (
    <View style={styles.header}>
      {view.signIn.error !== null && (
        <AppErrorBanner text={accountErrorText(view.signIn.error)} onDismiss={view.signIn.dismissError} />
      )}
      {view.bulk.error !== null && (
        <AppErrorBanner text={accountErrorText(view.bulk.error)} onDismiss={view.bulk.dismissError} />
      )}
      {view.account !== null && (
        <View style={styles.profile}>
          <AccountAvatar account={view.account} size="small" />
          <View style={styles.profileText}>
            <AppText role="title" scale="large" numberOfLines={1}>
              {view.account.name ?? view.account.username}
            </AppText>
            <AppText role="body" scale="small" color="onSurfaceVariant">
              {t({ key: 'account.tmdbUser', params: { username: view.account.username } })}
            </AppText>
          </View>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sections}>
        {sections.map((section) => (
          <AppChip
            key={section}
            label={t({ key: `account.section.${section}` })}
            icon={emptyIcons[section]}
            selected={view.section === section}
            onPress={() => {
              view.setSection(section);
            }}
          />
        ))}
      </ScrollView>
      {view.needsSignIn && <SignInCard onSignIn={view.signIn.signIn} isSigningIn={view.signIn.isSigningIn} />}
      {!view.needsSignIn && view.section !== 'lists' && (
        <View style={styles.kinds}>
          <AppSegmented
            segments={view.kinds.map((kind) => ({ value: kind, label: t({ key: `account.kind.${kind}` }) }))}
            selected={view.kind}
            onSelect={view.setKind}
          />
          {view.canSelect && !view.selection.isSelecting && (
            <AppButton
              label={t({ key: 'common.select' })}
              variant="text"
              onPress={() => {
                view.startSelecting();
              }}
            />
          )}
        </View>
      )}
      {view.section === 'lists' && view.isSignedIn && (
        <AppButton
          label={t({ key: 'account.newList' })}
          icon={{ ios: 'plus', android: 'add' }}
          variant="secondary"
          onPress={view.openCreateSheet}
        />
      )}
    </View>
  );
};

/** Recommendations under the watchlist: what to add once the list itself has been seen. */
const ForYou = ({ view }: { readonly view: LibraryView }) => {
  const t = useTranslate();
  if (view.section !== 'watchlist' || view.recommendations.length === 0) return null;
  return (
    <View style={styles.forYou}>
      <MediaRail
        title={t({ key: 'account.forYou' })}
        items={view.recommendations}
        onSelect={view.openTitle}
      />
    </View>
  );
};

const bulkActionIcons: Readonly<Record<BulkAction, AppAction['icon']>> = {
  addToWatchlist: { ios: 'bookmark', android: 'bookmark_add' },
  addToList: { ios: 'text.badge.plus', android: 'playlist_add' },
  removeFromWatchlist: { ios: 'trash', android: 'delete' },
};

const SelectionBar = ({ view }: { readonly view: LibraryView }) => {
  const t = useTranslate();
  const { selection, bulk } = view;
  const count = selection.selected.length;
  const run: Readonly<Record<BulkAction, () => void>> = {
    addToWatchlist: bulk.addToWatchlist,
    addToList: bulk.openListPicker,
    removeFromWatchlist: bulk.removeFromWatchlist,
  };
  return (
    <AppActionBar
      title={
        count === 0 ? t({ key: 'common.selectItems' }) : t({ key: 'common.selectedCount', params: { count } })
      }
      cancelLabel={t({ key: 'common.cancel' })}
      onCancel={selection.end}
      toggleAllLabel={t({
        key: selection.allSelected(view.items) ? 'common.deselectAll' : 'common.selectAll',
      })}
      onToggleAll={() => {
        selection.toggleAll(view.items);
      }}
      actions={view.bulkActions.map((action) => ({
        label: t({ key: `account.bulk.${action}` }),
        icon: bulkActionIcons[action],
        onPress: run[action],
        destructive: action === 'removeFromWatchlist',
        disabled: count === 0 || bulk.isWorking,
      }))}
    />
  );
};

const Empty = ({ view }: { readonly view: LibraryView }) => {
  const t = useTranslate();
  if (view.needsSignIn) return null;
  if (view.isLoading) return <AppLoading variant="inline" />;
  return (
    <AppEmptyState
      icon={emptyIcons[view.section]}
      title={t({ key: `account.empty.${view.section}.title` })}
      message={t({ key: `account.empty.${view.section}.message` })}
    />
  );
};

export const LibraryScreen = (props: LibraryScreenProps) => {
  const view = useLibraryScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={accountErrorText(view.error)} onRetry={view.retry} />;

  return (
    <>
      {view.section === 'lists' ? (
        <FlatList
          data={view.needsSignIn ? [] : view.lists}
          keyExtractor={(list) => String(list.id)}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.screen}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Header view={view} />}
          ListEmptyComponent={<Empty view={view} />}
          onEndReached={view.loadMore}
          ListFooterComponent={view.isLoadingMore ? <AppLoading variant="inline" /> : null}
          renderItem={({ item }) => <ListRow list={item} onPress={view.openList} />}
        />
      ) : (
        <MediaGrid
          items={view.needsSignIn ? [] : view.items}
          onSelect={view.openMedia}
          onLongPress={view.startSelecting}
          {...(view.selection.isSelecting
            ? { isSelected: view.selection.isSelected, bottomSpace: appActionBarSpace }
            : {})}
          onEndReached={view.loadMore}
          isLoadingMore={view.isLoadingMore}
          header={<Header view={view} />}
          empty={<Empty view={view} />}
          footer={<ForYou view={view} />}
          {...(view.section === 'rated'
            ? {
                captionFor: (media) => {
                  const rating = view.ratingOf(media);
                  return rating === undefined
                    ? undefined
                    : t({ key: 'account.yourRating', params: { rating: formatRating(rating) } });
                },
              }
            : {})}
        />
      )}
      {view.selection.isSelecting && <SelectionBar view={view} />}
      <ListPickerSheet
        visible={view.bulk.listPicker.visible}
        title={view.bulk.listPicker.title}
        lists={view.bulk.listPicker.lists}
        isLoading={view.bulk.listPicker.isLoading}
        addedTo={view.bulk.listPicker.addedTo}
        onPick={view.bulk.listPicker.pick}
        onDone={view.bulk.listPicker.close}
      />
      <CreateListSheet
        visible={view.isCreateSheetOpen}
        name={view.draftName}
        description={view.draftDescription}
        canCreate={view.canCreateList}
        isCreating={view.isCreatingList}
        error={view.createError}
        onChangeName={view.setDraftName}
        onChangeDescription={view.setDraftDescription}
        onCreate={view.createList}
        onClose={view.closeCreateSheet}
      />
    </>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xxl + rt.insets.bottom,
    flexGrow: 1,
  },
  header: {
    gap: theme.spacing.l,
    paddingBottom: theme.spacing.s,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  profileText: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  sections: {
    gap: theme.spacing.s,
  },
  kinds: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  forYou: {
    marginHorizontal: -theme.spacing.l,
    marginTop: theme.spacing.xl,
  },
}));
