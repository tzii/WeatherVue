const BASE_URL = 'https://api.cognitive.microsofttranslator.com/translate'
const API_VERSION = '3.0'

interface TranslationResult {
  translations: {
    text: string
    to: string
  }[]
}

export const translateText = async (
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
    return data[0]?.translations[0]?.text || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}
