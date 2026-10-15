/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@shell/(.*)$': '<rootDir>/src/shell/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
  },
  setupFiles: ['react-native-unistyles/mocks', '<rootDir>/src/shell/app/unistyles.ts'],
  clearMocks: true,
};
