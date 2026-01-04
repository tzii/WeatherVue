import type { WeatherCode, WeatherType, WeatherCodeInfo } from '@/types'

// WMO Weather Code mappings
export const WEATHER_CODES: Record<WeatherCode, WeatherCodeInfo> = {
  0: { code: 0, description: 'Clear Sky', type: 'clear', icon: 'Sun' },
  1: { code: 1, description: 'Mainly Clear', type: 'clear', icon: 'Sun' },
  2: { code: 2, description: 'Partly Cloudy', type: 'cloudy', icon: 'CloudSun' },
  3: { code: 3, description: 'Overcast', type: 'cloudy', icon: 'Cloud' },
  45: { code: 45, description: 'Foggy', type: 'fog', icon: 'CloudFog' },
  48: { code: 48, description: 'Rime Fog', type: 'fog', icon: 'CloudFog' },
  51: { code: 51, description: 'Light Drizzle', type: 'rain', icon: 'CloudDrizzle' },
  53: { code: 53, description: 'Moderate Drizzle', type: 'rain', icon: 'CloudDrizzle' },
  55: { code: 55, description: 'Dense Drizzle', type: 'rain', icon: 'CloudDrizzle' },
  56: { code: 56, description: 'Light Freezing Drizzle', type: 'rain', icon: 'CloudDrizzle' },
  57: { code: 57, description: 'Dense Freezing Drizzle', type: 'rain', icon: 'CloudDrizzle' },
  61: { code: 61, description: 'Slight Rain', type: 'rain', icon: 'CloudRain' },
  63: { code: 63, description: 'Moderate Rain', type: 'rain', icon: 'CloudRain' },
  65: { code: 65, description: 'Heavy Rain', type: 'rain', icon: 'CloudRainWind' },
  66: { code: 66, description: 'Light Freezing Rain', type: 'rain', icon: 'CloudRain' },
  67: { code: 67, description: 'Heavy Freezing Rain', type: 'rain', icon: 'CloudRainWind' },
  71: { code: 71, description: 'Slight Snow', type: 'snow', icon: 'Snowflake' },
  73: { code: 73, description: 'Moderate Snow', type: 'snow', icon: 'Snowflake' },
  75: { code: 75, description: 'Heavy Snow', type: 'snow', icon: 'Snowflake' },
  77: { code: 77, description: 'Snow Grains', type: 'snow', icon: 'Snowflake' },
  80: { code: 80, description: 'Slight Rain Showers', type: 'rain', icon: 'CloudRain' },
  81: { code: 81, description: 'Moderate Rain Showers', type: 'rain', icon: 'CloudRain' },
  82: { code: 82, description: 'Violent Rain Showers', type: 'storm', icon: 'CloudRainWind' },
  85: { code: 85, description: 'Slight Snow Showers', type: 'snow', icon: 'CloudSnow' },
  86: { code: 86, description: 'Heavy Snow Showers', type: 'snow', icon: 'CloudSnow' },
  95: { code: 95, description: 'Thunderstorm', type: 'storm', icon: 'CloudLightning' },
  96: { code: 96, description: 'Thunderstorm with Hail', type: 'storm', icon: 'CloudLightning' },
  99: { code: 99, description: 'Heavy Thunderstorm', type: 'storm', icon: 'CloudLightning' }
}

export const getWeatherType = (code: WeatherCode): WeatherType => {
  return WEATHER_CODES[code]?.type ?? 'clear'
}

export const getWeatherDescription = (code: WeatherCode): string => {
  return WEATHER_CODES[code]?.description ?? 'Unknown'
}

export const getWeatherIcon = (code: WeatherCode, isDay: boolean = true): string => {
  const info = WEATHER_CODES[code]
  if (!info) return 'Cloud'
  
  // Use moon for clear nights
  if ((code === 0 || code === 1) && !isDay) {
    return 'Moon'
  }
  
  return info.icon
}

// Linear interpolation
export const interpolateValue = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

// Map value from one range to another
export const mapRange = (
  value: number, 
  inMin: number, 
  inMax: number, 
  outMin: number, 
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
