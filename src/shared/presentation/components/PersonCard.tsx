import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppIcon } from '@shared/core/presentation/components/AppIcon';
import { AppImage } from '@shared/core/presentation/components/AppImage';
import { AppPressable } from '@shared/core/presentation/components/AppPressable';
import { AppText } from '@shared/core/presentation/components/AppText';

export type PersonCardProps = {
  readonly name: string;
  /** A character, a job or a department. */
  readonly detail: string | null;
  readonly imageUri: string | null;
  readonly onPress: () => void;
};

const size = 84;

/** A round portrait with a name under it, for cast rails and people rails. */
export const PersonCard = ({ name, detail, imageUri, onPress }: PersonCardProps) => (
  <AppPressable
    feedback="scale"
    onPress={onPress}
    accessibilityLabel={detail === null ? name : `${name}, ${detail}`}
    style={{ width: size + 12 }}
  >
    <View style={styles.portrait}>
      <AppImage uri={imageUri} shape="full" style={{ width: size, height: size }} />
      {imageUri === null && (
        <View style={styles.placeholder}>
          <AppIcon name={{ ios: 'person.fill', android: 'person' }} size="l" color="onSurfaceVariant" />
        </View>
      )}
    </View>
    <View style={styles.caption}>
      <AppText role="label" scale="large" numberOfLines={2} style={{ textAlign: 'center' }}>
        {name}
      </AppText>
      {detail !== null && (
        <AppText
          role="label"
          scale="medium"
          color="onSurfaceVariant"
          numberOfLines={2}
          style={{ textAlign: 'center' }}
        >
          {detail}
        </AppText>
      )}
    </View>
  </AppPressable>
);

const styles = StyleSheet.create((theme) => ({
  caption: {
    marginTop: theme.spacing.s,
  },
  portrait: {
    alignSelf: 'center',
    width: size,
    height: size,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
