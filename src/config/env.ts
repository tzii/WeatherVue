 // Environment configuration
 // API keys should be set via environment variables, not hardcoded
 // In production, use a backend proxy to avoid exposing keys to the client
 
 interface EnvConfig {
   azureTranslatorKey: string | undefined
   azureTranslatorRegion: string
   useTranslationProxy: boolean
   translationProxyUrl: string
 }
 
 export const env: EnvConfig = {
   // Azure Translator API - prefer proxy in production
   azureTranslatorKey: import.meta.env.VITE_AZURE_TRANSLATOR_KEY,
   azureTranslatorRegion: import.meta.env.VITE_AZURE_TRANSLATOR_REGION || 'eastus',
   
   // Use a backend proxy to hide API keys in production
   useTranslationProxy: import.meta.env.VITE_USE_TRANSLATION_PROXY === 'true',
   translationProxyUrl: import.meta.env.VITE_TRANSLATION_PROXY_URL || '/api/translate'
 }
 
 // Warn if API key is exposed in production
 if (import.meta.env.PROD && env.azureTranslatorKey && !env.useTranslationProxy) {
   console.warn(
     '[WeatherVue] Warning: Azure API key is exposed in production. ' +
     'Consider using VITE_USE_TRANSLATION_PROXY=true with a backend proxy.'
   )
 }
