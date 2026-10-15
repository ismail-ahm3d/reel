import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppText } from '@shared/core/presentation/components/AppText';
import { SectionHeader } from '@shared/presentation/components/SectionHeader';

export type InfoRow = {
  readonly label: string;
  readonly value: string;
};

export type InfoListProps = {
  readonly title: string;
  readonly rows: readonly InfoRow[];
};

/** Label over value, two per line, like the "Information" block of the App Store. */
export const InfoList = ({ title, rows }: InfoListProps) => {
  if (rows.length === 0) return null;
  return (
    <View>
      <SectionHeader title={title} />
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.label} style={styles.cell}>
            <AppText role="label" scale="large" color="onSurfaceVariant">
              {row.label}
            </AppText>
            <AppText role="body" scale="medium" selectable>
              {row.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.l,
    rowGap: theme.spacing.l,
  },
  cell: {
    width: '50%',
    paddingRight: theme.spacing.m,
    gap: theme.spacing.xxs,
  },
}));
