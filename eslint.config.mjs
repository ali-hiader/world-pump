import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const config = [
  {
    ignores: ['**/next-env.d.ts', '.next/**', 'node_modules/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Type imports
            ['^.+\\u0000$'],
            // Node.js builtins prefixed with `node:`.
            ['^node:', '^next', '^react'],
            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^@?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ['^@/lib', '^'],
            // Relative imports.
            // Anything that starts with a dot.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      // "@typescript-eslint/no-unused-vars": [
      //     "error",
      //     {
      //         args: "all",
      //         argsIgnorePattern: "^_",
      //         caughtErrors: "all",
      //         caughtErrorsIgnorePattern: "^_",
      //         destructuredArrayIgnorePattern: "^_",
      //         varsIgnorePattern: "^_",
      //         ignoreRestSiblings: true,
      //     },
      // ],
    },
  },
]

export default config
