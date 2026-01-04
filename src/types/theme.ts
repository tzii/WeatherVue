// Theme Types

export type Theme = 'light' | 'dark' | 'system' | 'terminal'

export type TemperatureUnit = 'celsius' | 'fahrenheit'

export type SpeedUnit = 'kmh' | 'mph' | 'ms'

export type PressureUnit = 'hpa' | 'inhg' | 'mmhg'

export interface ThemeColors {
  bgBody: string
  bgCard: string
  bgCardHover: string
  bgDrawer: string
  bgGlass: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string
  borderDefault: string
  borderStrong: string
  accent: string
}

export interface WeatherColors {
  skyStart: string
  skyEnd: string
  atmosphere: string
  particleColor?: string
}

export interface UserSettings {
  // Appearance
  theme: Theme
  reducedMotion: boolean
  
  // Units
  temperatureUnit: TemperatureUnit
  speedUnit: SpeedUnit
  pressureUnit: PressureUnit
  use24Hour: boolean
  
  // Accessibility
  highContrast: boolean
  sonificationEnabled: boolean
  
  // Audio
  ambientAudioEnabled: boolean
  ambientVolume: number
  
  // Haptics
  hapticsEnabled: boolean
  
  // Data
  autoRefresh: boolean
  refreshInterval: number // minutes
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  reducedMotion: false,
  temperatureUnit: 'celsius',
  speedUnit: 'kmh',
  pressureUnit: 'hpa',
  use24Hour: true,
  highContrast: false,
  sonificationEnabled: false,
  ambientAudioEnabled: false,
  ambientVolume: 50,
  hapticsEnabled: true,
  autoRefresh: true,
  refreshInterval: 15
}
