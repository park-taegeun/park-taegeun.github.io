import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

// 소스(src/)만 린트. 자료 폴더·빌드 산출물·설정은 제외.
// 핵심 의도: 미사용 import/변수를 error로 막아 CI 빌드 사고(예: 미사용 AnimatePresence) 재발 방지.
export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      '이미지_생성결과',
      '이미지_래퍼런스',
      '참고 자료 이미지',
      'ITC Avant Garde',
      'manifest',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  prettier,
)
