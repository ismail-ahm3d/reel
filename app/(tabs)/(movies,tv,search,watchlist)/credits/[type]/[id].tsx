import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { isMediaType } from '@shared/domain/model/media';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { CreditsScreen } from '@features/title/presentation/screens/credits/CreditsScreen';

export default function CreditsRoute() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const { title } = useDependencies();
  const t = useTranslate();
  if (!isMediaType(type)) return null;
  return (
    <>
      <Stack.Screen options={{ title: t({ key: 'title.castAndCrew' }), headerLargeTitleEnabled: true }} />
      <CreditsScreen
        mediaRef={{ type, id: Number(id) }}
        useCases={title}
        onOpenPerson={appNavigation.openPerson}
      />
    </>
  );
}
