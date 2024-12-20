import { config } from 'dotenv'
import { resolve } from 'path'
import { pathsToModuleNameMapper } from 'ts-jest'
const { compilerOptions } = require('./tsconfig.json')

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
config({ path: resolve(__dirname, envFile) })

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**',
    '!src/**/index.ts',
    '!src/interfaces/http/middlewares/**',
    '!src/server.ts',
    '!src/application/useCases/**/*.responseModel.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
}
