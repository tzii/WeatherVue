import type { 
  WeatherData, 
  CurrentWeather, 
  HourlyForecast, 
  DailyForecast,
  WeatherCode 
} from '@/types'
import { API_ENDPOINTS, CURRENT_PARAMS, HOURLY_PARAMS, DAILY_PARAMS } from '@/utils/constants'

interface OpenMeteoCurrentResponse {
  time: string
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  rain: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  wind_speed_10m: number
  wind_direction_10m: number
  uv_index: number
  visibility: number
}

interface OpenMeteoHourlyResponse {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  wind_direction_10m: number[]
  uv_index: number[]
  is_day: number[]
}

interface OpenMeteoDailyResponse {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
  precipitation_probability_max: number[]
  precipitation_sum: number[]
  wind_speed_10m_max: number[]
}

interface OpenMeteoResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current?: OpenMeteoCurrentResponse
  hourly?: OpenMeteoHourlyResponse
  daily?: OpenMeteoDailyResponse
}

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: CURRENT_PARAMS.join(','),
    hourly: HOURLY_PARAMS.join(','),
    daily: DAILY_PARAMS.join(','),
    timezone: 'auto',
    forecast_days: '7',
    forecast_hours: '48'
  })

  const response = await fetch(`${API_ENDPOINTS.WEATHER}?${params}`)
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`)
  }
  
  const data: OpenMeteoResponse = await response.json()
  
  return transformWeatherData(data)
}

const transformWeatherData = (data: OpenMeteoResponse): WeatherData => {
  if (!data.current || !data.hourly || !data.daily) {
    throw new Error('Invalid weather data response')
  }
  
  const current = transformCurrentWeather(data.current)
  const hourly = transformHourlyForecast(data.hourly)
  const daily = transformDailyForecast(data.daily)
  
  // Add precipitation probability from first hour of forecast
  const firstHour = hourly[0]
  if (firstHour) {
    current.precipitationProbability = firstHour.precipitationProbability
  }
  
  return {
    current,
    hourly,
    daily,
    timezone: data.timezone,
    lastUpdated: new Date()
  }
}

const transformCurrentWeather = (data: OpenMeteoCurrentResponse): CurrentWeather => {
  return {
    time: data.time,
    temperature: data.temperature_2m,
    feelsLike: data.apparent_temperature,
    humidity: data.relative_humidity_2m,
    precipitation: data.precipitation,
    rain: data.rain,
    weatherCode: data.weather_code as WeatherCode,
    cloudCover: data.cloud_cover,
    pressure: data.pressure_msl,
    windSpeed: data.wind_speed_10m,
    windDirection: data.wind_direction_10m,
    uvIndex: data.uv_index,
    isDay: data.is_day === 1,
    visibility: data.visibility / 1000
  }
}

const transformHourlyForecast = (data: OpenMeteoHourlyResponse): HourlyForecast[] => {
  return data.time.map((time, i) => ({
    time,
    temperature: data.temperature_2m[i] ?? 0,
    humidity: data.relative_humidity_2m[i] ?? 0,
    precipitationProbability: data.precipitation_probability[i] ?? 0,
    precipitation: data.precipitation[i] ?? 0,
    weatherCode: (data.weather_code[i] ?? 0) as WeatherCode,
    windSpeed: data.wind_speed_10m[i] ?? 0,
    windDirection: data.wind_direction_10m[i] ?? 0,
    uvIndex: data.uv_index[i] ?? 0,
    isDay: (data.is_day[i] ?? 1) === 1
  }))
}

const transformDailyForecast = (data: OpenMeteoDailyResponse): DailyForecast[] => {
  return data.time.map((date, i) => ({
    date,
    weatherCode: (data.weather_code[i] ?? 0) as WeatherCode,
    temperatureMax: data.temperature_2m_max[i] ?? 0,
    temperatureMin: data.temperature_2m_min[i] ?? 0,
    sunrise: data.sunrise[i] ?? '',
    sunset: data.sunset[i] ?? '',
    uvIndexMax: data.uv_index_max[i] ?? 0,
    precipitationProbabilityMax: data.precipitation_probability_max[i] ?? 0,
    precipitationSum: data.precipitation_sum[i] ?? 0,
    windSpeedMax: data.wind_speed_10m_max[i] ?? 0
  }))
}
