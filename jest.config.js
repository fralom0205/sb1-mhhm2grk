/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/services/__tests__/content/**/*.test.{ts,tsx}',
    '<rootDir>/src/features/content/**/__tests__/**/*.test.{ts,tsx}'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Maps 'src/*' alias to Jest paths
    '^@/(.*)$': '<rootDir>/src/$1', // Maps '@/*' alias
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS/SCSS imports
     '^../../types/content$': '<rootDir>/src/types/content.ts', // Explicit mapping for content
    '^../../services/content/base.service$': '<rootDir>/src/services/content/base.service.ts', // Explicit mapping for base.service
  },
  moduleDirectories: ['node_modules', 'src'], // Include node_modules and src in module resolution
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }], // Process TypeScript files
  },
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Jest setup file
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', // Match __tests__ folders
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}', // Match spec/test files
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Recognized file extensions
  collectCoverageFrom: [
    'src/services/content/**/*.{ts,tsx}',
    'src/features/content/**/*.{ts,tsx}',
    '!src/**/*.d.ts', // Exclude declaration files
    '!src/main.tsx', // Exclude main entry files
    '!src/vite-env.d.ts', // Exclude Vite environment declarations
    '!src/**/*.stories.{ts,tsx}', // Exclude Storybook files
    '!src/**/__tests__/**/*', // Exclude test files
    '!src/**/*.test.{ts,tsx}' // Exclude test files
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70 // Adjusted coverage thresholds for focused testing
    },
  },
};

export default config; // Use ESM export syntax
