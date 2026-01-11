/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_TRANSLATOR_KEY?: string
  readonly VITE_AZURE_TRANSLATOR_REGION?: string
  readonly VITE_USE_TRANSLATION_PROXY?: string
  readonly VITE_TRANSLATION_PROXY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
