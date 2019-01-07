module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'config/tsconfig.jest.json',
    },
  },
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  rootDir: '..',
  roots: [
    '<rootDir>',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/config/setupTests.js',
  testEnvironment: 'jsdom',
  testRegex: '\\.spec\\.(tsx|jsx)$',
  preset: 'ts-jest',
  testMatch: null,
}