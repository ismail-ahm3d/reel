/** The roles a theme provides. A new role is added here with its reason; values live in the app. */
type Pair<Role extends string> = Record<Role | `on${Capitalize<Role>}`, string>;

/**
 * `scrim` was added for text laid over artwork (hero backdrops): it is the overlay colour and
 * `onScrim` the text on it, whatever the scheme. `stage` was added for media viewers (the photo
 * gallery), which stay black in both schemes so pictures read as they were shot.
 */
export type BaseColor = Pair<
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'error'
  | 'success'
  | 'warning'
  | 'background'
  | 'surface'
  | 'surfaceVariant'
  | 'scrim'
  | 'stage'
> & {
  readonly outline: string;
};

export type TextToken = {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: '400' | '500' | '600' | '700' | '800';
  readonly letterSpacing: number;
};

export type TypeScale = 'large' | 'medium' | 'small';
export type BaseTypography = Record<
  'display' | 'headline' | 'title' | 'body' | 'label',
  Record<TypeScale, TextToken>
>;
export type BaseSpacing = Record<'none' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl', number>;
export type BaseShape = Record<'none' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'full', number>;
export type BaseBorder = Record<'none' | 'hairline' | 'thin' | 'medium' | 'thick' | 'heavy', number>;
/** Added for symbols: an icon's size is not a text size, and icons sit beside text of every role. */
export type BaseIconSize = Record<'s' | 'm' | 'l' | 'xl', number>;

export type AppTheme = {
  readonly colors: Readonly<BaseColor>;
  readonly typography: Readonly<BaseTypography>;
  readonly spacing: Readonly<BaseSpacing>;
  readonly shape: Readonly<BaseShape>;
  readonly border: Readonly<BaseBorder>;
  readonly iconSize: Readonly<BaseIconSize>;
};

export type AppThemes = { readonly light: AppTheme; readonly dark: AppTheme };
