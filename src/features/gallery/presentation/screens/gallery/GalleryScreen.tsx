import { FlatList, ScrollView, View, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import { AppErrorView } from '@shared/core/presentation/components/AppErrorView';
import { AppIconButton } from '@shared/core/presentation/components/AppIconButton';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppLoading } from '@shared/core/presentation/components/AppLoading';
import { AppText } from '@shared/core/presentation/components/AppText';
import { errorText } from '@shared/core/presentation/mappers/errorText';
import {
  useGalleryScreen,
  type GalleryScreenProps,
} from '@features/gallery/presentation/screens/gallery/useGalleryScreen';

/** Full-screen pictures, one per page; each page zooms with a pinch (iOS) and pans when zoomed. */
export const GalleryScreen = (props: GalleryScreenProps) => {
  const view = useGalleryScreen(props);
  const t = useTranslate();
  const { width, height } = useWindowDimensions();

  if (view.error !== null) return <AppErrorView text={errorText(view.error)} onRetry={view.retry} />;
  if (view.isLoading) return <AppLoading />;

  return (
    <View style={styles.stage}>
      <FlatList
        key={view.kind}
        horizontal
        pagingEnabled
        data={view.images}
        keyExtractor={(item) => item.image.large}
        initialScrollIndex={view.startIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          view.showPage(Math.round(event.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item, index }) => (
          <ScrollView
            style={{ width, height }}
            contentContainerStyle={styles.page}
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <AppImage
              uri={item.image.large}
              fit="contain"
              transparent
              style={{ width, height: Math.min(height, width / item.aspectRatio) }}
              accessibilityLabel={t({ key: 'gallery.imageLabel', params: { number: index + 1 } })}
            />
          </ScrollView>
        )}
      />
      <View style={styles.bottomBar} pointerEvents="box-none">
        {view.kinds.length > 1 && (
          <View style={styles.kinds}>
            {view.kinds.map((kind) => (
              <AppChip
                key={kind}
                label={t({ key: `gallery.kind.${kind}` })}
                selected={view.kind === kind}
                tone="onMedia"
                onPress={() => {
                  view.selectKind(kind);
                }}
              />
            ))}
          </View>
        )}
        <View style={styles.footer}>
          <AppText role="label" scale="large" color="onStage">
            {t({ key: 'gallery.counter', params: { current: view.index + 1, total: view.images.length } })}
          </AppText>
          <AppIconButton
            icon={{ ios: 'square.and.arrow.up', android: 'share' }}
            accessibilityLabel={t({ key: 'common.share' })}
            onPress={view.shareCurrent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  stage: {
    flex: 1,
    backgroundColor: theme.colors.stage,
  },
  page: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    gap: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    paddingBottom: rt.insets.bottom + theme.spacing.m,
  },
  kinds: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
