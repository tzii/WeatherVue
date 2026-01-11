 import js from '@eslint/js'
 import vue from 'eslint-plugin-vue'
 import tsParser from '@typescript-eslint/parser'
 
 export default [
   js.configs.recommended,
   ...vue.configs['flat/recommended'],
   {
     files: ['**/*.{js,ts,vue}'],
     languageOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
       parser: tsParser,
       parserOptions: {
         extraFileExtensions: ['.vue']
       },
       globals: {
         window: 'readonly',
         document: 'readonly',
         navigator: 'readonly',
         console: 'readonly',
         setTimeout: 'readonly',
         clearTimeout: 'readonly',
         setInterval: 'readonly',
         clearInterval: 'readonly',
         fetch: 'readonly',
         URLSearchParams: 'readonly',
         AudioContext: 'readonly',
         OscillatorNode: 'readonly',
         GainNode: 'readonly',
         requestAnimationFrame: 'readonly',
         cancelAnimationFrame: 'readonly',
         HTMLElement: 'readonly',
         MouseEvent: 'readonly',
         KeyboardEvent: 'readonly',
         Event: 'readonly',
         ResizeObserver: 'readonly'
       }
     },
     rules: {
       'vue/multi-word-component-names': 'off',
       'vue/require-default-prop': 'off',
       'vue/no-v-html': 'off',
       '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
       'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
       'no-console': ['warn', { allow: ['warn', 'error'] }]
     }
   },
   {
     ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts']
   }
 ]
