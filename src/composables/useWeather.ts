import { ref, watch, type Ref } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { fetchWeatherData } from '@/services/weatherApi'
import { cache } from '@/services/cache'
import { CACHE_TTL } from '@/utils/constants'
import type { Location, WeatherData } from '@/types'

export const useWeather = (location: Ref<Location | null>) => {
  const store = useWeatherStore()
  const lastFetchTime = ref<number>(0)
  const retryCount = ref(0)
  const isRetrying = ref(false)
  const MAX_RETRIES = 3
  const BASE_DELAY = 1000

  const refreshWeather = async (force = false) => {
    if (!location.value) return

    const { latitude, longitude } = location.value
    const cacheKey = cache.weatherKey(latitude, longitude)
    
    // Check if we need to fetch
    if (!force) {
      const cachedData = cache.get<WeatherData>(cacheKey)
      if (cachedData) {
        store.setWeatherData(cachedData)
        return
      }
    }

    store.setLoading(true)
    try {
      const data = await fetchWeatherData(latitude, longitude)
      store.setWeatherData(data)
      cache.set(cacheKey, data, CACHE_TTL.weather)
      lastFetchTime.value = Date.now()
      retryCount.value = 0
    } catch (err: any) {
      store.setError(err)
    } finally {
      store.setLoading(false)
    }
  }

  const retryWithBackoff = async () => {
    if (!location.value || retryCount.value >= MAX_RETRIES) return
    
    isRetrying.value = true
    const delay = BASE_DELAY * Math.pow(2, retryCount.value)
    
    await new Promise(resolve => setTimeout(resolve, delay))
    retryCount.value++
    
    try {
      await refreshWeather(true)
      isRetrying.value = false
    } catch {
      isRetrying.value = false
      if (retryCount.value < MAX_RETRIES) {
        await retryWithBackoff()
      }
    }
  }

  // SWR Pattern: Return cached data immediately, then fetch fresh data in background
  const getSwrWeather = async () => {
    if (!location.value) return

    const { latitude, longitude } = location.value
    const cacheKey = cache.weatherKey(latitude, longitude)
    
    const cachedData = cache.get<WeatherData>(cacheKey)
    if (cachedData) {
      store.setWeatherData(cachedData)
      
      // If data is older than 5 minutes, revalidate in background
      const isStale = Date.now() - new Date(cachedData.lastUpdated).getTime() > 5 * 60 * 1000
      if (isStale) {
        // Background fetch
        fetchWeatherData(latitude, longitude)
          .then(data => {
            store.setWeatherData(data)
            cache.set(cacheKey, data, CACHE_TTL.weather)
          })
          .catch(console.error)
      }
    } else {
      // No cache, full fetch
      await refreshWeather(true)
    }
  }

  // Watch for location changes
  watch(() => location.value, (newLoc) => {
    if (newLoc) {
      getSwrWeather()
    }
  }, { deep: true })

  return {
    refreshWeather,
    getSwrWeather,
    retryWithBackoff,
    isRetrying,
    retryCount
  }
}
