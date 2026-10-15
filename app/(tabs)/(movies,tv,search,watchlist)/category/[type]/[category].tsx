import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { isMediaType } from '@shared/domain/model/media';
import { useDependencies } from '@shell/presentation/dependencies';
import { appNavigation } from '@shell/presentation/navigation';
import { isCategoryOf } from '@features/discover/domain/model/category';
import { categoryTitleKey } from '@features/discover/presentation/mappers/discoverText';
import { CategoryScreen } from '@features/discover/presentation/screens/category/CategoryScreen';

export default function CategoryRoute() {
  const { type, category } = useLocalSearchParams<{ type: string; category: string }>();
  const { discover } = useDependencies();
  const t = useTranslate();
  if (!isMediaType(type) || !isCategoryOf(type, category)) return null;
  return (
    <>
      <Stack.Screen
        options={{ title: t({ key: categoryTitleKey(type, category) }), headerLargeTitleEnabled: true }}
      />
      <CategoryScreen
        type={type}
        category={category}
        useCases={discover}
        onOpenMedia={appNavigation.openMedia}
      />
    </>
  );
}
