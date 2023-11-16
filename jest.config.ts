import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: [
    '**/*.(t|j)s',
    'jest.config.ts',
    '!**/main.ts',
    '!**/migration/*',
    '!**/*.module.(t|j)s',
    '!**/*.dto.(t|j)s',
    '!**/*.entity.(t|j)s',
    '!**/*.decorator.(t|j)s',
    '!**/*.guard.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/', // Ignorar arquivos em node_modules (opcional)
    '/dist/',
    '\\.d\\.ts$', // Ignorar arquivos com extensão .d.ts
    '.js',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};
