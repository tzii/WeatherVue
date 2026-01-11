const BASE_URL = 'https://api.cognitive.microsofttranslator.com/translate'
const API_VERSION = '3.0'

import { env } from '@/config/env'

interface TranslationResult {
  translations: {
    text: string
    to: string
  }[]
}

// Translation via backend proxy (recommended for production)
const translateViaProxy = async (text: string, to: string): Promise<string> => {
  try {
    const response = await fetch(env.translationProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, to })
    })

    if (!response.ok) {
      throw new Error(`Proxy translation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.translation || text
  } catch (error) {
    console.error('Proxy translation error:', error)
    return text
  }
}

// Direct translation (only for development)
const translateDirect = async (text: string, to: string): Promise<string> => {
  const apiKey = env.azureTranslatorKey
  const region = env.azureTranslatorRegion
  
  if (!apiKey) {
    console.warn('Azure Translator API key not configured')
    return text
  }
  
  try {
    const url = `${BASE_URL}?api-version=${API_VERSION}&to=${to}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ Text: text }])
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`)
    }

    const data: TranslationResult[] = await response.json()
    const firstResult = data[0]
    const firstTranslation = firstResult?.translations[0]
    return firstTranslation?.text || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

// Main translation function - uses proxy if configured
export const translateText = async (text: string, to: string): Promise<string> => {
  if (!text) return text
  
  if (env.useTranslationProxy) {
    return translateViaProxy(text, to)
  }
  
  return translateDirect(text, to)
}

// Legacy function for backward compatibility
export const translateTextWithKey = async (
  text: string, 
  to: string, 
  apiKey: string, 
  region: string
): Promise<string> => {
  if (!apiKey || !text) return text
  
  try {
    const url = `${BASE_URL}?api-version=${API_VERSION}&to=${to}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ Text: text }])
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`)
    }

    const data: TranslationResult[] = await response.json()
    const firstResult = data[0]
    const firstTranslation = firstResult?.translations[0]
    return firstTranslation?.text || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}
