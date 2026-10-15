import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppText } from '@shared/core/presentation/components/AppText';

export type Segment<T extends string> = { readonly value: T; readonly label: string };

export type AppSegmentedProps<T extends string> = {
  readonly segments: readonly Segment<T>[];
  readonly selected: T;
  readonly onSelect: (value: T) => void;
};

/** A compact segmented control: a sunken track with the selected segment raised. */
export const AppSegmented = <T extends string>({ segments, selected, onSelect }: AppSegmentedProps<T>) => (
  <View style={styles.track} accessibilityRole="tablist">
    {segments.map((segment) => {
      const isSelected = segment.value === selected;
      return (
        <Pressable
          key={segment.value}
          accessibilityRole="tab"
          accessibilityLabel={segment.label}
          accessibilityState={{ selected: isSelected }}
          onPress={() => {
            onSelect(segment.value);
          }}
          style={styles.segment(isSelected)}
        >
          <AppText role="label" scale="large" color={isSelected ? 'onSurface' : 'onSurfaceVariant'}>
            {segment.label}
          </AppText>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create((theme) => ({
  track: {
    flexDirection: 'row',
    padding: theme.spacing.xxs,
    borderRadius: theme.shape.s,
    backgroundColor: theme.colors.surfaceVariant,
  },
  segment: (selected: boolean) => ({
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.shape.s - theme.spacing.xxs,
    backgroundColor: selected ? theme.colors.background : 'transparent',
  }),
}));
