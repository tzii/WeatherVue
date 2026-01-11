import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  WeatherData, 
  CurrentWeather, 
  HourlyForecast, 
  DailyForecast,
  WeatherType,
  InterpolatedWeather 
} from '@/types'
import { getWeatherType, interpolateValue } from '@/utils/weatherCodes'

export const useWeatherStore = defineStore('weather', () => {
  // State
  const current = ref<CurrentWeather | null>(null)
  const hourly = ref<HourlyForecast[]>([])
  const daily = ref<DailyForecast[]>([])
  const timezone = ref<string>('')
  const lastUpdated = ref<Date | null>(null)
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  
  // Timeline scrubber position (0-1 representing 48 hours)
  const timelinePosition = ref(0)
  
  // Getters
  const hasData = computed(() => current.value !== null)
  
  const weatherType = computed<WeatherType>(() => {
    if (!current.value) return 'clear'
    return getWeatherType(current.value.weatherCode)
  })
  
  // Interpolated weather based on timeline position
  const interpolatedWeather = computed<InterpolatedWeather | null>(() => {
    if (hourly.value.length < 2) return null
    
    const totalHours = hourly.value.length - 1
    const exactIndex = timelinePosition.value * totalHours
    const lowerIndex = Math.floor(exactIndex)
    const upperIndex = Math.min(lowerIndex + 1, totalHours)
    const fraction = exactIndex - lowerIndex
    
    const lower = hourly.value[lowerIndex]
    const upper = hourly.value[upperIndex]
    
    if (!lower || !upper) return null
    
    return {
      temperature: interpolateValue(lower.temperature, upper.temperature, fraction),
      humidity: interpolateValue(lower.humidity, upper.humidity, fraction),
      precipitation: interpolateValue(lower.precipitation, upper.precipitation, fraction),
      precipitationProbability: interpolateValue(
        lower.precipitationProbability, 
        upper.precipitationProbability, 
        fraction
      ),
      windSpeed: interpolateValue(lower.windSpeed, upper.windSpeed, fraction),
      uvIndex: interpolateValue(lower.uvIndex, upper.uvIndex, fraction),
      cloudCover: interpolateValue(lower.humidity, upper.humidity, fraction), // Approximation
      isDay: fraction < 0.5 ? lower.isDay : upper.isDay,
      weatherType: getWeatherType(fraction < 0.5 ? lower.weatherCode : upper.weatherCode)
    }
  })
  
  // Current time position on timeline (0-1)
  const currentTimePosition = computed(() => {
    if (hourly.value.length === 0) return 0
    
    const now = new Date()
    const firstHourData = hourly.value[0]
    const lastHourData = hourly.value[hourly.value.length - 1]
    
    if (!firstHourData || !lastHourData) return 0
    
    const firstHour = new Date(firstHourData.time)
    const lastHour = new Date(lastHourData.time)
    
    const totalMs = lastHour.getTime() - firstHour.getTime()
    const elapsedMs = now.getTime() - firstHour.getTime()
    
    return Math.max(0, Math.min(1, elapsedMs / totalMs))
  })
  
  // Actions
  const setWeatherData = (data: WeatherData) => {
    current.value = data.current
    hourly.value = data.hourly
    daily.value = data.daily
    timezone.value = data.timezone
    lastUpdated.value = data.lastUpdated
    error.value = null
  }
  
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  
  const setError = (err: Error | null) => {
    error.value = err
    isLoading.value = false
  }
  
  const setTimelinePosition = (position: number) => {
    timelinePosition.value = Math.max(0, Math.min(1, position))
  }
  
  const resetTimelineToNow = () => {
    timelinePosition.value = currentTimePosition.value
  }
  
  const clearData = () => {
    current.value = null
    hourly.value = []
    daily.value = []
    timezone.value = ''
    lastUpdated.value = null
    error.value = null
    timelinePosition.value = 0
  }
  
  return {
    // State
    current,
    hourly,
    daily,
    timezone,
    lastUpdated,
    isLoading,
    error,
    timelinePosition,
    
    // Getters
    hasData,
    weatherType,
    interpolatedWeather,
    currentTimePosition,
    
    // Actions
    setWeatherData,
    setLoading,
    setError,
    setTimelinePosition,
    resetTimelineToNow,
    clearData
  }
})
