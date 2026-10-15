import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';
import type { Company } from '@shared/domain/model/company';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type CompanyRailProps = {
  readonly title: string;
  readonly companies: readonly Company[];
  readonly onSelect: (company: Company) => void;
};

/** Studio and network logos on light tiles: most logos are dark artwork made for white pages. */
export const CompanyRail = ({ title, companies, onSelect }: CompanyRailProps) => {
  if (companies.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} />
      <FlatList
        horizontal
        data={companies}
        keyExtractor={(company) => String(company.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <AppPressable
            onPress={() => {
              onSelect(item);
            }}
            accessibilityLabel={item.name}
            accessibilityRole="link"
          >
            <View style={styles.tile}>
              {item.logo === null ? (
                <AppText
                  role="title"
                  scale="small"
                  color="scrim"
                  numberOfLines={2}
                  style={{ textAlign: 'center' }}
                >
                  {item.name}
                </AppText>
              ) : (
                <AppImage
                  uri={item.logo.medium}
                  fit="contain"
                  transparent
                  style={{ width: 96, height: 40 }}
                />
              )}
            </View>
            <View style={styles.caption}>
              <AppText
                role="label"
                scale="medium"
                color="onSurfaceVariant"
                numberOfLines={1}
                style={{ textAlign: 'center' }}
              >
                {item.name}
              </AppText>
            </View>
          </AppPressable>
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
  tile: {
    width: 128,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
    borderRadius: theme.shape.m,
    backgroundColor: theme.colors.onScrim,
    borderWidth: theme.border.hairline,
    borderColor: theme.colors.outline,
  },
  caption: {
    width: 128,
    marginTop: theme.spacing.xs,
  },
}));
