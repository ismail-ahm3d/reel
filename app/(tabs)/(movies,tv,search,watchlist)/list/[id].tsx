import { Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { largeTitles } from '@shell/presentation/largeTitles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { ListScreen } from '@features/account/presentation/screens/list/ListScreen';

export default function ListRoute() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { account, watchlist } = useDependencies();
  const t = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: name ?? '', headerLargeTitleEnabled: largeTitles }} />
      <ListScreen
        listId={Number(id)}
        useCases={account}
        watchlist={watchlist}
        onOpenMedia={appNavigation.openMedia}
        onConfirmDelete={(listName) =>
          new Promise((resolve) => {
            Alert.alert(
              t({ key: 'account.deleteListTitle', params: { name: listName } }),
              t({ key: 'account.deleteListMessage' }),
              [
                {
                  text: t({ key: 'common.cancel' }),
                  style: 'cancel',
                  onPress: () => {
                    resolve(false);
                  },
                },
                {
                  text: t({ key: 'account.deleteList' }),
                  style: 'destructive',
                  onPress: () => {
                    resolve(true);
                  },
                },
              ],
            );
          })
        }
        onDeleted={() => {
          router.back();
        }}
      />
    </>
  );
}
