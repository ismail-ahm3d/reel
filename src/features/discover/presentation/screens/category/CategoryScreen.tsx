import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import { MediaGrid } from '@shared/presentation/components/MediaGrid';
import { GridSkeleton } from '@shared/presentation/components/Skeletons';
import {
  useCategoryScreen,
  type CategoryScreenProps,
} from '@features/discover/presentation/screens/category/useCategoryScreen';

export const CategoryScreen = (props: CategoryScreenProps) => {
  const view = useCategoryScreen(props);
  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <GridSkeleton />;
  return (
    <MediaGrid
      items={view.items}
      onSelect={view.openMedia}
      onEndReached={view.loadMore}
      isLoadingMore={view.isLoadingMore}
    />
  );
};
