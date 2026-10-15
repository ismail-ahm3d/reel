import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import type { WatchOptions, WatchProvider } from '@features/title/domain/model/titleDetails';

export type WatchProvidersProps = {
  readonly options: WatchOptions;
  readonly onOpen: (url: string) => void;
};

const logoSize = 52;

const Group = ({
  label,
  providers,
}: {
  readonly label: string;
  readonly providers: readonly WatchProvider[];
}) => {
  if (providers.length === 0) return null;
  return (
    <View style={styles.group}>
      <AppText role="label" scale="medium" color="onSurfaceVariant">
        {label.toUpperCase()}
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.logos}>
        {providers.map((provider) => (
          <View key={provider.id} accessible accessibilityLabel={provider.name}>
            <AppImage
              uri={provider.logo?.medium ?? null}
              shape="m"
              style={{ width: logoSize, height: logoSize }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

/** Streaming first, then free, rent and buy; the whole block links to the full JustWatch page. */
export const WatchProviders = ({ options, onOpen }: WatchProvidersProps) => {
  const t = useTranslate();
  const { link } = options;
  const content = (
    <View style={styles.card}>
      <Group label={t({ key: 'title.watch.stream' })} providers={options.stream} />
      <Group label={t({ key: 'title.watch.free' })} providers={options.free} />
      <Group label={t({ key: 'title.watch.rent' })} providers={options.rent} />
      <Group label={t({ key: 'title.watch.buy' })} providers={options.buy} />
      <AppText role="label" scale="medium" color="onSurfaceVariant">
        {t({ key: 'title.watch.attribution' })}
      </AppText>
    </View>
  );
  return (
    <View>
      <SectionHeader title={t({ key: 'title.whereToWatch' })} />
      {link === null ? (
        content
      ) : (
        <AppPressable
          onPress={() => {
            onOpen(link);
          }}
          accessibilityLabel={t({ key: 'title.whereToWatch' })}
          accessibilityRole="link"
        >
          {content}
        </AppPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: theme.spacing.l,
    padding: theme.spacing.l,
    gap: theme.spacing.l,
    borderRadius: theme.shape.l,
    backgroundColor: theme.colors.surface,
  },
  group: {
    gap: theme.spacing.s,
  },
  logos: {
    gap: theme.spacing.s,
  },
}));
