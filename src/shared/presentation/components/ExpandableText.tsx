import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';

export type ExpandableTextProps = {
  readonly text: string;
  readonly moreLabel: string;
  readonly lines?: number;
};

/** A long paragraph clamped to a few lines; tapping it shows the rest. */
export const ExpandableText = ({ text, moreLabel, lines = 4 }: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const clampable = text.length > 220;
  if (!clampable) {
    return (
      <AppText role="body" scale="large">
        {text}
      </AppText>
    );
  }
  return (
    <AppPressable
      onPress={() => {
        setExpanded(!expanded);
      }}
      accessibilityLabel={text}
    >
      <View style={styles.block}>
        <AppText role="body" scale="large" {...(expanded ? {} : { numberOfLines: lines })}>
          {text}
        </AppText>
        {!expanded && (
          <AppText role="title" scale="medium" color="primary">
            {moreLabel}
          </AppText>
        )}
      </View>
    </AppPressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  block: {
    gap: theme.spacing.xs,
  },
}));
