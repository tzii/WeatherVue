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

  // Selected day index (0 = today, 1 = tomorrow, etc.)
  const selectedDayIndex = ref(0)

  // Getters
  const hasData = computed(() => current.value !== null)

  const weatherType = computed<WeatherType>(() => {
    // If viewing a future day, use that day's weather code
    if (selectedDayIndex.value > 0 && daily.value[selectedDayIndex.value]) {
      return getWeatherType(daily.value[selectedDayIndex.value].weatherCode)
    }

    if (!current.value) return 'clear'
    return getWeatherType(current.value.weatherCode)
  })

  // Weather to display in the main Hero section
  const displayWeather = computed<CurrentWeather | null>(() => {
    // If today (index 0), return current weather (or interpolated if scrubbing)
    if (selectedDayIndex.value === 0) {
      return interpolatedWeather.value || current.value
    }

    // If future day, map DailyForecast to CurrentWeather structure
    const day = daily.value[selectedDayIndex.value]
    if (!day) return null

    // Create a synthetic CurrentWeather object from daily forecast
    return {
      time: day.date,
      temperature: day.temperatureMax, // Show max temp as primary
      feelsLike: day.temperatureMax, // Approx
      humidity: 0, // Not available in daily
      precipitation: day.precipitationSum,
      rain: day.precipitationSum,
      weatherCode: day.weatherCode,
      cloudCover: 0, // Not available
      pressure: 1013, // Standard pressure default
      windSpeed: day.windSpeedMax,
      windDirection: 0,
      uvIndex: day.uvIndexMax,
      isDay: true, // Always show day theme for future forecasts
      visibility: 10 // Default good visibility
    } as CurrentWeather
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
      cloudCover: interpolateValue(lower.cloudCover || 0, upper.cloudCover || 0, fraction), // Fixed: was using humidity
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
    // If scrubbing, ensure we're looking at today
    if (selectedDayIndex.value !== 0) {
      selectedDayIndex.value = 0
    }
  }

  const resetTimelineToNow = () => {
    timelinePosition.value = currentTimePosition.value
    selectedDayIndex.value = 0
  }

  const selectDay = (index: number) => {
    if (index >= 0 && index < daily.value.length) {
      selectedDayIndex.value = index
      // Reset timeline if switching days
      timelinePosition.value = 0
    }
  }

  const clearData = () => {
    current.value = null
    hourly.value = []
    daily.value = []
    timezone.value = ''
    lastUpdated.value = null
    error.value = null
    timelinePosition.value = 0
    selectedDayIndex.value = 0
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
    selectedDayIndex,

    // Getters
    hasData,
    weatherType,
    displayWeather,
    interpolatedWeather,
    currentTimePosition,

    // Actions
    setWeatherData,
    setLoading,
    setError,
    setTimelinePosition,
    resetTimelineToNow,
    selectDay,
    clearData
  }
})
