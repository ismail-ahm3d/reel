import { I18nManager } from 'react-native';
import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import { useUnistyles } from 'react-native-unistyles';
import type { BaseColor, BaseIconSize } from '@shared/core/presentation/theme/contract';

/** A symbol on each platform: SF Symbols on iOS, Material Symbols on Android. */
export type IconName = {
  readonly ios: SFSymbol;
  readonly android: AndroidSymbol;
  /** Points along the reading direction (chevrons, arrows): mirrored in right-to-left layouts. */
  readonly directional?: boolean;
};

export type AppIconProps = {
  readonly name: IconName;
  readonly size?: keyof BaseIconSize;
  readonly color?: keyof BaseColor;
};

export const AppIcon = ({ name, size = 'm', color = 'onBackground' }: AppIconProps) => {
  const { theme } = useUnistyles();
  const dimension = theme.iconSize[size];
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.android }}
      size={dimension}
      tintColor={theme.colors[color]}
      style={{
        width: dimension,
        height: dimension,
        transform: [{ scaleX: name.directional === true && I18nManager.isRTL ? -1 : 1 }],
      }}
      accessible={false}
      importantForAccessibility="no"
    />
  );
};
