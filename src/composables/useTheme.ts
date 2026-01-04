import { watch, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useWeatherStore } from '@/stores/weatherStore'

export const useTheme = () => {
  const settingsStore = useSettingsStore()
  const weatherStore = useWeatherStore()

  const currentTheme = computed(() => settingsStore.effectiveTheme)
  const currentWeatherType = computed(() => weatherStore.weatherType)
  const isDay = computed(() => {
    // Check interpolated weather if available, otherwise current
    if (weatherStore.interpolatedWeather) {
      return weatherStore.interpolatedWeather.isDay
    }
    return weatherStore.current?.isDay ?? true
  })

  const updateAttributes = () => {
    const root = document.documentElement
    
    // Theme attribute (light/dark/terminal)
    if (currentTheme.value === 'terminal') {
      root.setAttribute('data-theme', 'terminal')
    } else if (currentTheme.value === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }

    // Weather attribute
    if (weatherStore.hasData) {
      root.setAttribute('data-weather', currentWeatherType.value)
      root.setAttribute('data-time', isDay.value ? 'day' : 'night')
    } else {
      root.removeAttribute('data-weather')
      root.removeAttribute('data-time')
    }
    
    // Accessibility attributes
    if (settingsStore.prefersReducedMotion) {
      root.setAttribute('data-reduced-motion', 'true')
    } else {
      root.removeAttribute('data-reduced-motion')
    }
  }

  // Watch for changes and update
  watch([currentTheme, currentWeatherType, isDay, () => settingsStore.prefersReducedMotion], () => {
    updateAttributes()
  })

  onMounted(() => {
    settingsStore.init()
    updateAttributes()
  })

  return {
    currentTheme,
    currentWeatherType,
    isDay,
    updateAttributes
  }
}
