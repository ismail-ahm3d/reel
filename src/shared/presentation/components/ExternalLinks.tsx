import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslate } from '@shared/core/presentation/i18n/useTranslate';
import { AppChip } from '@shared/core/presentation/components/AppChip';
import type { IconName } from '@shared/core/presentation/components/AppIcon';
import type { ExternalLink, ExternalLinkKind } from '@shared/domain/model/externalLink';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type ExternalLinksProps = {
  readonly links: readonly ExternalLink[];
  readonly onOpen: (url: string) => void;
};

/** Brand names are not translated; only "Website" is a word. */
const brandNames: Readonly<Record<Exclude<ExternalLinkKind, 'homepage'>, string>> = {
  imdb: 'IMDb',
  wikidata: 'Wikidata',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const icons: Readonly<Record<ExternalLinkKind, IconName>> = {
  homepage: { ios: 'safari', android: 'public' },
  imdb: { ios: 'film', android: 'movie' },
  wikidata: { ios: 'books.vertical', android: 'menu_book' },
  facebook: { ios: 'person.2', android: 'group' },
  instagram: { ios: 'camera', android: 'photo_camera' },
  twitter: { ios: 'bubble.left', android: 'chat_bubble' },
  tiktok: { ios: 'music.note', android: 'music_note' },
  youtube: { ios: 'play.rectangle', android: 'smart_display' },
};

export const ExternalLinks = ({ links, onOpen }: ExternalLinksProps) => {
  const t = useTranslate();
  if (links.length === 0) return null;
  return (
    <View>
      <SectionHeader title={t({ key: 'common.links' })} />
      <View style={styles.wrap}>
        {links.map((link) => (
          <AppChip
            key={link.kind}
            label={link.kind === 'homepage' ? t({ key: 'common.website' }) : brandNames[link.kind]}
            icon={icons[link.kind]}
            onPress={() => {
              onOpen(link.url);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
}));
