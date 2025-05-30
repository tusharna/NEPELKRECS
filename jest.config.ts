// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 20,  // Minimum branch coverage percentage (e.g., 80%)
      functions: 20, // Minimum function coverage percentage (e.g., 80%)
      lines: 20,     // Minimum line coverage percentage (e.g., 80%)
      statements: 20 // Minimum statement coverage percentage (e.g., 80%)
    }
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",     // include all source files
    "!src/**/*.d.ts",       // exclude type declarations
    "!tests/**/*.ts", // optionally exclude test folders
  ],
  coverageDirectory: "coverage",
};

export default config;
/** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   type: 'module',
//   testEnvironment: 'node',
// };

