import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppSheet } from '@shared/core/presentation/components/AppSheet';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { UserList } from '@features/account/domain/model/account';
import { ListRow } from '@features/account/presentation/components/ListRow';

export type ListPickerSheetProps = {
  readonly visible: boolean;
  readonly title: string;
  readonly lists: readonly UserList[];
  readonly isLoading: boolean;
  /** Lists the titles went into while the sheet was open; they say so under the row. */
  readonly addedTo: readonly number[];
  readonly onPick: (list: UserList) => void;
  readonly onDone: () => void;
};

/** The user's lists as a sheet: tap one to add to it, as often as needed, then Done. */
export const ListPickerSheet = ({
  visible,
  title,
  lists,
  isLoading,
  addedTo,
  onPick,
  onDone,
}: ListPickerSheetProps) => {
  const t = useTranslate();
  return (
    <AppSheet visible={visible} title={title} doneLabel={t({ key: 'common.done' })} onDone={onDone}>
      {isLoading ? (
        <AppLoading variant="inline" />
      ) : lists.length === 0 ? (
        <AppText role="body" scale="medium" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
          {t({ key: 'account.noListsYet' })}
        </AppText>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={lists}
          keyExtractor={(list) => String(list.id)}
          renderItem={({ item }) =>
            addedTo.includes(item.id) ? (
              <View style={styles.added}>
                <ListRow list={item} onPress={onPick} trailing="add" />
                <AppText role="label" scale="large" color="success">
                  {t({ key: 'account.added' })}
                </AppText>
              </View>
            ) : (
              <ListRow list={item} onPress={onPick} trailing="add" />
            )
          }
        />
      )}
    </AppSheet>
  );
};

const styles = StyleSheet.create((theme) => ({
  added: {
    gap: theme.spacing.xxs,
  },
}));
