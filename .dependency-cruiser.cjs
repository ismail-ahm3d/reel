// The layer, zone and feature boundaries from the project-layout skill. A red rule is fixed in the
// code, never here; a rule changes only with a decision record.
const FRAMEWORKS =
  '^(?:node_modules/)?(?:react|react-native|expo|expo-[^/]+|@expo/[^/]+|@react-native[^/]*/[^/]+|@react-navigation/[^/]+|react-native-[^/]+|@tanstack/[^/]+|axios|ky)(?:/|$)';

module.exports = {
  forbidden: [
    {
      name: 'domain-is-inner',
      severity: 'error',
      comment: 'domain imports no data or presentation',
      from: { path: '^src/.*/domain/' },
      to: { path: '^src/.*/(?:data|presentation)/' },
    },
    {
      name: 'domain-is-plain',
      severity: 'error',
      comment: 'domain imports no framework, HTTP or storage library',
      from: { path: '^src/.*/domain/' },
      to: { path: FRAMEWORKS },
    },
    {
      name: 'query-in-presentation',
      severity: 'error',
      comment: 'TanStack Query is presentation state; data and domain never see it',
      from: { path: '^src/.*/data/' },
      to: { path: '^(?:node_modules/)?@tanstack/[^/]+(?:/|$)' },
    },
    {
      name: 'data-not-presentation',
      severity: 'error',
      from: { path: '^src/.*/data/' },
      to: { path: '^src/.*/presentation/' },
    },
    {
      name: 'presentation-not-data',
      severity: 'error',
      comment: 'they meet only in composition',
      from: { path: '^src/.*/presentation/' },
      to: { path: '^src/.*/data/' },
    },
    {
      name: 'no-feature-to-feature',
      severity: 'error',
      comment: 'what two features need moves to shared',
      from: { path: '^src/features/([^/]+)/' },
      to: { path: '^src/features/', pathNot: '^src/features/$1/' },
    },
    {
      name: 'shared-is-shared',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/(?:features|shell)/' },
    },
    {
      name: 'features-not-shell',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/shell/' },
    },
    { name: 'src-not-routes', severity: 'error', from: { path: '^src/' }, to: { path: '^app/' } },
    {
      name: 'host-is-a-root',
      severity: 'error',
      comment: 'only app/ and index.ts import src/shell/app',
      from: { path: '^src/', pathNot: '^src/shell/app/' },
      to: { path: '^src/shell/app/' },
    },
    {
      name: 'composition-from-host-only',
      severity: 'error',
      from: { pathNot: '^src/shell/app/' },
      to: { path: '^src/features/[^/]+/composition\\.ts$' },
    },
    {
      name: 'features-do-not-navigate',
      severity: 'error',
      comment: "navigation is the route file's job",
      from: { path: '^src/features/' },
      to: { path: '^(?:node_modules/)?(?:expo-router|@react-navigation/[^/]+)(?:/|$)' },
    },
    {
      name: 'fakes-in-tests-only',
      severity: 'error',
      from: { pathNot: '\\.(?:test|fake|testing)\\.tsx?$' },
      to: { path: '\\.(?:fake|testing)\\.tsx?$' },
    },
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    { name: 'not-to-unresolvable', severity: 'error', from: {}, to: { couldNotResolve: true } },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '^(?:\\.expo|dist|ios|android|coverage)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types', 'react-native'],
      extensions: [
        '.ios.ts',
        '.android.ts',
        '.native.ts',
        '.ts',
        '.ios.tsx',
        '.android.tsx',
        '.native.tsx',
        '.tsx',
        '.d.ts',
        '.js',
        '.json',
      ],
      mainFields: ['react-native', 'module', 'main', 'types', 'typings'],
    },
  },
};
