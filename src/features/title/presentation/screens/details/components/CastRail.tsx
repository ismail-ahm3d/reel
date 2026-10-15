import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { PersonCard } from '@shared/presentation/components/PersonCard';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';
import type { CastMember } from '@features/title/domain/model/titleDetails';

export type CastRailProps = {
  readonly title: string;
  readonly cast: readonly CastMember[];
  readonly onSelect: (personId: number) => void;
  readonly onSeeAll: () => void;
  /** "62 episodes", for shows. */
  readonly episodesLabel: (count: number) => string;
};

export const CastRail = ({ title, cast, onSelect, onSeeAll, episodesLabel }: CastRailProps) => {
  if (cast.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} onSeeAll={onSeeAll} />
      <FlatList
        horizontal
        data={cast.slice(0, 20)}
        keyExtractor={(member) => String(member.personId)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <PersonCard
            name={item.name}
            detail={
              item.episodeCount === null
                ? item.role
                : [item.role, episodesLabel(item.episodeCount)].filter((part) => part !== null).join(' · ')
            }
            imageUri={item.profile?.small ?? null}
            onPress={() => {
              onSelect(item.personId);
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  rail: {
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.m,
  },
}));
