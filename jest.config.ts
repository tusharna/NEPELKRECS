// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
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