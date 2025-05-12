import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: '@typescript-eslint/recommended'
});

const baseRules = {
  indent: ['error', 2, { MemberExpression: 1 }],
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'comma-dangle': ['error', 'never'],
  'comma-spacing': ['error', { 'before': false, 'after': true }],
  'eol-last': ['error', 'always'],
  'key-spacing': ['error', { 'afterColon': true }],
  'no-multiple-empty-lines': ['error'],
  'space-before-function-paren': ['error', {
    'anonymous': 'always',
    'named': 'never',
    'asyncArrow': 'always'
  }],
  'no-undef': 'off',
  'no-async-promise-executor': 'off',
  'no-unexpected-multiline': 'off'
};

export default [
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  {
    files: ['**/*.js'],
    rules: baseRules
  },
  {
    files: [
      'apps/server/**/*.ts',
      'packages/**/*.ts'
    ],
    rules: {
      ...baseRules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: ['apps/client/**/*.ts', 'apps/client/**/*.tsx'],
    rules: {
      ...baseRules,
      'semi': ['error', 'never'],
      'jsx-quotes': ['error', 'prefer-single'],
      'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'ignore' }],
      'react/function-component-definition': [2, { namedComponents: 'arrow-function', unnamedComponents: 'function-expression' }],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-undef': 'off',
      'no-async-promise-executor': 'off'
    }
  }
];
