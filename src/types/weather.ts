// Weather Types

export interface CurrentWeather {
  time: string
  temperature: number
  feelsLike: number
  humidity: number
  precipitation: number
  precipitationProbability?: number
  rain: number
  weatherCode: WeatherCode
  cloudCover: number
  pressure: number
  windSpeed: number
  windDirection: number
  uvIndex: number
  visibility: number
  isDay: boolean
}

export interface HourlyForecast {
  time: string
  temperature: number
  humidity: number
  precipitationProbability: number
  precipitation: number
  weatherCode: WeatherCode
  cloudCover: number
  windSpeed: number
  windDirection: number
  uvIndex: number
  isDay: boolean
}

export interface DailyForecast {
  date: string
  weatherCode: WeatherCode
  temperatureMax: number
  temperatureMin: number
  sunrise: string
  sunset: string
  uvIndexMax: number
  precipitationProbabilityMax: number
  precipitationSum: number
  windSpeedMax: number
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  timezone: string
  lastUpdated: Date
}

// WMO Weather Codes
export type WeatherCode =
  | 0 // Clear sky
  | 1 // Mainly clear
  | 2 // Partly cloudy
  | 3 // Overcast
  | 45 // Fog
  | 48 // Rime fog
  | 51 // Light drizzle
  | 53 // Moderate drizzle
  | 55 // Dense drizzle
  | 56 // Light freezing drizzle
  | 57 // Dense freezing drizzle
  | 61 // Slight rain
  | 63 // Moderate rain
  | 65 // Heavy rain
  | 66 // Light freezing rain
  | 67 // Heavy freezing rain
  | 71 // Slight snow
  | 73 // Moderate snow
  | 75 // Heavy snow
  | 77 // Snow grains
  | 80 // Slight rain showers
  | 81 // Moderate rain showers
  | 82 // Violent rain showers
  | 85 // Slight snow showers
  | 86 // Heavy snow showers
  | 95 // Thunderstorm
  | 96 // Thunderstorm with slight hail
  | 99 // Thunderstorm with heavy hail

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'

export interface WeatherCodeInfo {
  code: WeatherCode
  description: string
  type: WeatherType
  icon: string
}

// Interpolated weather for timeline scrubbing
export interface InterpolatedWeather {
  temperature: number
  humidity: number
  precipitation: number
  precipitationProbability: number
  windSpeed: number
  uvIndex: number
  cloudCover: number
  isDay: boolean
  weatherType: WeatherType
}
