// The mechanical half of the ts-react-native-plugin rules. Layer and feature boundaries are in
// .dependency-cruiser.cjs; every rule here is one a skill states, and names that skill.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier/flat');

const TESTS = 'src/**/*.test.{ts,tsx}';
const WRAPPERS = 'src/shared/core/presentation/components/**';
const THEME_VALUES = 'src/shell/app/theme/**';

// no-restricted-imports and no-restricted-syntax are replaced, not merged, by a later block that
// matches the same file. Each block below therefore lists every restriction for its paths, and
// blocks go from general to specific.
const LAYOUT_IMPORTS = [
  { group: ['../*'], message: 'Use the @shell, @shared or @features alias (project-layout).' },
  {
    group: ['**/index', '**/index.ts', '**/index.tsx'],
    message: 'No barrel files: import the declaring file (project-layout).',
  },
];
const RN_IMPORTS = [
  {
    name: 'react-native',
    importNames: ['StyleSheet'],
    message: 'StyleSheet comes from react-native-unistyles (design-system).',
  },
  {
    name: 'react-native',
    importNames: [
      'TouchableOpacity',
      'TouchableHighlight',
      'TouchableWithoutFeedback',
      'TouchableNativeFeedback',
    ],
    message: 'Use the Pressable or Button wrapper (design-system).',
  },
];
const WRAPPED_IMPORTS = [
  {
    name: 'react-native',
    importNames: ['Text', 'Pressable', 'TextInput', 'Image'],
    message: 'Use the design-system wrapper for this primitive (design-system).',
  },
];

const LITERALS = [
  {
    selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
    message: 'Colours come from the theme (design-system rule 1).',
  },
  {
    selector: 'Literal[value=/^(?:rgb|rgba|hsl|hsla)\\(/]',
    message: 'Colours come from the theme (design-system rule 1).',
  },
  {
    selector:
      'Property[key.name=/^(?:margin|padding|gap|rowGap|columnGap|fontSize|lineHeight|letterSpacing|borderRadius|border(?:Top|Right|Bottom|Left)?Width)/] > Literal[value!=0]',
    message: 'Spacing, type, radius and border come from the theme (design-system rule 1).',
  },
];
const CATCH = [
  { selector: 'TryStatement', message: 'Only the data-source wrappers catch (error-handling rule 3).' },
  {
    selector: "CallExpression[callee.property.name='catch']",
    message: 'Only the data-source wrappers catch (error-handling rule 3).',
  },
];
const OUTCOME = [
  {
    selector: "CallExpression[callee.name='outcome']",
    message: 'outcome() only in domain/usecases (error-handling rule 5).',
  },
  {
    selector: "CallExpression[callee.name='asOutcome']",
    message: 'asOutcome() only in domain/usecases (error-handling rule 5).',
  },
];
const MESSAGE = [
  {
    selector: "MemberExpression[property.name='message']",
    message: 'Show errorText(error), never error.message (error-handling rule 7).',
  },
];

const INSPECT = [
  {
    selector: "BinaryExpression[operator='instanceof'][right.name=/Error$/]",
    message: 'Only error-text mappers look at an error family (error-handling rule 6).',
  },
];
const UI_TEXT = [
  {
    selector: 'JSXText[value=/[A-Za-z]/]',
    message: 'User-visible text comes from a translation key (presentation-structure).',
  },
];

const imports = (files, paths) => ({
  files,
  ignores: [TESTS],
  rules: { 'no-restricted-imports': ['error', { patterns: LAYOUT_IMPORTS, paths }] },
});
const syntax = (files, selectors) => ({
  files,
  ignores: [TESTS],
  rules: { 'no-restricted-syntax': ['error', ...selectors] },
});

module.exports = defineConfig([
  expoConfig,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: __dirname } },
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ], // coding-principles 14
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }], // Unistyles theme registration
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'import/no-default-export': 'error' }, // project-layout: named exports only under src/
  },
  {
    files: ['src/**/*.fake.ts'],
    rules: { '@typescript-eslint/require-await': 'off' }, // fakes implement async interfaces without awaiting
  },

  imports(['src/**/*.{ts,tsx}'], [...RN_IMPORTS, ...WRAPPED_IMPORTS]),
  imports([WRAPPERS], RN_IMPORTS),

  syntax(['src/**/*.{ts,tsx}'], [...LITERALS, ...CATCH, ...OUTCOME]),
  syntax(['src/**/domain/usecases/**'], [...LITERALS, ...CATCH]),
  syntax(['src/**/presentation/**'], [...LITERALS, ...CATCH, ...OUTCOME, ...MESSAGE, ...INSPECT, ...UI_TEXT]),
  syntax(['src/**/presentation/mappers/**'], [...LITERALS, ...CATCH, ...OUTCOME, ...MESSAGE]),
  syntax(['src/shared/external/*/data/**'], [...LITERALS, ...OUTCOME]),
  syntax(['src/shared/core/**'], LITERALS),
  syntax(['src/shared/core/presentation/**'], [...LITERALS, ...MESSAGE, ...INSPECT, ...UI_TEXT]),
  syntax(['src/shared/core/presentation/mappers/**'], [...LITERALS, ...MESSAGE]),
  syntax([WRAPPERS], [...LITERALS, ...MESSAGE, ...INSPECT, ...UI_TEXT]),
  syntax([THEME_VALUES], [...CATCH, ...OUTCOME]),

  prettier,
  {
    ignores: [
      '.expo/',
      'dist/',
      'ios/',
      'android/',
      'node_modules/',
      'coverage/',
      '*.config.js',
      '.dependency-cruiser.cjs',
    ],
  },
]);
