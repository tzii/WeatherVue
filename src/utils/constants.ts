// API Endpoints
export const API_ENDPOINTS = {
  WEATHER: 'https://api.open-meteo.com/v1/forecast',
  GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
  TRANSLATION: 'https://api.cognitive.microsofttranslator.com/translate'
} as const

// Weather API parameters
export const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'rain',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'visibility'
] as const

export const HOURLY_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'is_day',
  'cloud_cover'
] as const

export const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_probability_max',
  'precipitation_sum',
  'wind_speed_10m_max'
] as const

// Animation durations (ms)
export const DURATIONS = {
  instant: 0,
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150
  }
} as const

// Breakpoints (px)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

// Z-index scale
export const Z_INDEX = {
  below: -1,
  base: 0,
  above: 1,
  header: 10,
  dropdown: 20,
  drawer: 30,
  modal: 40,
  toast: 50,
  splash: 100
} as const

// Languages for translation
export const LANGUAGES = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  zh: 'Chinese',
  ar: 'Arabic',
  ko: 'Korean',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  sv: 'Swedish'
} as const

// Cache TTLs (ms)
export const CACHE_TTL = {
  weather: 5 * 60 * 1000, // 5 minutes
  geocoding: 24 * 60 * 60 * 1000, // 24 hours
  settings: Infinity
} as const

// Network Retries
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  staleThreshold: 5 * 60 * 1000
} as const

// Haptic patterns
export const HAPTIC_PATTERNS = {
  tap: [10],
  success: [10, 50, 10],
  error: [50, 100, 50],
  lightRain: [50, 100, 50, 100, 50],
  heavyRain: [100, 50, 100, 50, 100, 50, 100],
  thunder: [200, 100, 500],
  snow: [30, 200, 30, 200, 30],
  wind: [20, 80, 20, 80, 20, 80, 20]
} as const
