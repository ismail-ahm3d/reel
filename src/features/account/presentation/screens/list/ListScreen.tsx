import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppActionBar, appActionBarSpace } from '@shared/core/presentation/components/AppActionBar';
import { AppButton } from '@shared/core/presentation/components/AppButton';
import { AppEmptyState } from '@shared/core/presentation/components/AppEmptyState';
import { AppErrorBanner } from '@shared/core/presentation/components/AppErrorBanner';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppIconButton } from '@shared/core/presentation/components/AppIconButton';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppText } from '@shared/core/presentation/components/AppText';
import { MediaGrid } from '@shared/presentation/components/MediaGrid';
import { ListPickerSheet } from '@features/account/presentation/components/ListPickerSheet';
import { accountErrorText } from '@features/account/presentation/mappers/accountErrorText';
import {
  useListScreen,
  type ListScreenProps,
} from '@features/account/presentation/screens/list/useListScreen';

export const ListScreen = (props: ListScreenProps) => {
  const view = useListScreen(props);
  const t = useTranslate();

  if (view.error !== null) return <AppErrorView text={accountErrorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading || view.list === null) return <AppLoading />;

  const { list, selection, bulk } = view;
  const count = selection.selected.length;
  const disabled = count === 0 || bulk.isWorking || view.isRemoving;

  return (
    <>
      <MediaGrid
        items={view.items}
        onSelect={view.openMedia}
        onLongPress={view.startSelecting}
        onEndReached={view.loadMore}
        isLoadingMore={view.isLoadingMore}
        {...(selection.isSelecting
          ? { isSelected: selection.isSelected, bottomSpace: appActionBarSpace }
          : {})}
        header={
          <View style={styles.header}>
            {view.actionError !== null && (
              <AppErrorBanner text={accountErrorText(view.actionError)} onDismiss={view.dismissActionError} />
            )}
            <AppText role="label" scale="large" color="onSurfaceVariant">
              {[
                t({ key: 'account.itemCount', params: { count: list.itemCount } }),
                t({ key: list.isPublic ? 'account.public' : 'account.private' }),
              ].join(' · ')}
            </AppText>
            {list.description !== '' && (
              <AppText role="body" scale="medium">
                {list.description}
              </AppText>
            )}
            <View style={styles.actions}>
              <AppButton
                label={t({ key: 'common.select' })}
                icon={{ ios: 'checkmark.circle', android: 'check_circle' }}
                variant="secondary"
                onPress={() => {
                  view.startSelecting();
                }}
                disabled={view.items.length === 0 || selection.isSelecting}
                style={{ flex: 1 }}
              />
              <AppIconButton
                icon={{ ios: 'square.and.arrow.up', android: 'share' }}
                accessibilityLabel={t({ key: 'common.share' })}
                onPress={view.share}
              />
              <AppIconButton
                icon={{ ios: 'trash', android: 'delete' }}
                accessibilityLabel={t({ key: 'account.deleteList' })}
                onPress={view.deleteList}
                disabled={view.isDeleting}
              />
            </View>
          </View>
        }
        empty={
          <AppEmptyState
            icon={{ ios: 'list.bullet.rectangle', android: 'list' }}
            title={t({ key: 'account.emptyListTitle' })}
            message={t({ key: 'account.emptyListMessage' })}
          />
        }
      />
      {selection.isSelecting && (
        <AppActionBar
          title={
            count === 0
              ? t({ key: 'common.selectItems' })
              : t({ key: 'common.selectedCount', params: { count } })
          }
          cancelLabel={t({ key: 'common.cancel' })}
          onCancel={selection.end}
          toggleAllLabel={t({
            key: selection.allSelected(view.items) ? 'common.deselectAll' : 'common.selectAll',
          })}
          onToggleAll={() => {
            selection.toggleAll(view.items);
          }}
          actions={[
            {
              label: t({ key: 'account.bulk.addToWatchlist' }),
              icon: { ios: 'bookmark', android: 'bookmark_add' },
              onPress: bulk.addToWatchlist,
              disabled,
            },
            {
              label: t({ key: 'account.bulk.addToList' }),
              icon: { ios: 'text.badge.plus', android: 'playlist_add' },
              onPress: bulk.openListPicker,
              disabled,
            },
            {
              label: t({ key: 'common.remove' }),
              icon: { ios: 'trash', android: 'delete' },
              onPress: view.removeSelected,
              destructive: true,
              disabled,
            },
          ]}
        />
      )}
      <ListPickerSheet
        visible={bulk.listPicker.visible}
        title={bulk.listPicker.title}
        lists={bulk.listPicker.lists}
        isLoading={bulk.listPicker.isLoading}
        addedTo={bulk.listPicker.addedTo}
        onPick={bulk.listPicker.pick}
        onDone={bulk.listPicker.close}
      />
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  header: {
    gap: theme.spacing.m,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
}));
