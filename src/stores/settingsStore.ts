import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme, TemperatureUnit, SpeedUnit, UserSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'

const SETTINGS_KEY = 'weathervue-settings'

export const useSettingsStore = defineStore('settings', () => {
  // State - initialized from defaults
  const theme = ref<Theme>(DEFAULT_SETTINGS.theme)
  const reducedMotion = ref(DEFAULT_SETTINGS.reducedMotion)
  
  const temperatureUnit = ref<TemperatureUnit>(DEFAULT_SETTINGS.temperatureUnit)
  const speedUnit = ref<SpeedUnit>(DEFAULT_SETTINGS.speedUnit)
  const use24Hour = ref(DEFAULT_SETTINGS.use24Hour)
  
  const highContrast = ref(DEFAULT_SETTINGS.highContrast)
  const sonificationEnabled = ref(DEFAULT_SETTINGS.sonificationEnabled)
  
  const ambientAudioEnabled = ref(DEFAULT_SETTINGS.ambientAudioEnabled)
  const ambientVolume = ref(DEFAULT_SETTINGS.ambientVolume)
  
  const hapticsEnabled = ref(DEFAULT_SETTINGS.hapticsEnabled)
  
  const autoRefresh = ref(DEFAULT_SETTINGS.autoRefresh)
  const refreshInterval = ref(DEFAULT_SETTINGS.refreshInterval)
  
  // Drawer state
  const isDrawerOpen = ref(false)
  
  // Computed
  const effectiveTheme = computed<'light' | 'dark' | 'terminal'>(() => {
    if (theme.value === 'terminal') return 'terminal'
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })
  
  const prefersReducedMotion = computed(() => {
    return reducedMotion.value || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  
  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme()
    persist()
  }
  
  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system', 'terminal']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }
  
  const cycleTheme = () => {
    // Simple cycle: light -> dark -> system
    if (theme.value === 'light') setTheme('dark')
    else if (theme.value === 'dark') setTheme('system')
    else setTheme('light')
  }
  
  const setTemperatureUnit = (unit: TemperatureUnit) => {
    temperatureUnit.value = unit
    persist()
  }
  
  const setSpeedUnit = (unit: SpeedUnit) => {
    speedUnit.value = unit
    persist()
  }
  
  const toggleReducedMotion = () => {
    reducedMotion.value = !reducedMotion.value
    persist()
  }
  
  const toggleHighContrast = () => {
    highContrast.value = !highContrast.value
    if (highContrast.value) {
      setTheme('terminal')
    }
    persist()
  }
  
  const toggleSonification = () => {
    sonificationEnabled.value = !sonificationEnabled.value
    persist()
  }
  
  const toggleAmbientAudio = () => {
    ambientAudioEnabled.value = !ambientAudioEnabled.value
    persist()
  }
  
  const setAmbientVolume = (volume: number) => {
    ambientVolume.value = Math.max(0, Math.min(100, volume))
    persist()
  }
  
  const toggleHaptics = () => {
    hapticsEnabled.value = !hapticsEnabled.value
    persist()
  }
  
  const openDrawer = () => {
    isDrawerOpen.value = true
  }
  
  const closeDrawer = () => {
    isDrawerOpen.value = false
  }
  
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }
  
  // Apply theme to document
  const applyTheme = () => {
    const root = document.documentElement
    const effective = effectiveTheme.value
    
    if (effective === 'terminal') {
      root.setAttribute('data-theme', 'terminal')
    } else if (effective === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }
  
  // Persist to localStorage
  const persist = () => {
    const settings: Partial<UserSettings> = {
      theme: theme.value,
      reducedMotion: reducedMotion.value,
      temperatureUnit: temperatureUnit.value,
      speedUnit: speedUnit.value,
      use24Hour: use24Hour.value,
      highContrast: highContrast.value,
      sonificationEnabled: sonificationEnabled.value,
      ambientAudioEnabled: ambientAudioEnabled.value,
      ambientVolume: ambientVolume.value,
      hapticsEnabled: hapticsEnabled.value,
      autoRefresh: autoRefresh.value,
      refreshInterval: refreshInterval.value
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }
  
  // Load from localStorage
  const init = () => {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      try {
        const settings = JSON.parse(stored) as Partial<UserSettings>
        
        if (settings.theme) theme.value = settings.theme
        if (settings.reducedMotion !== undefined) reducedMotion.value = settings.reducedMotion
        if (settings.temperatureUnit) temperatureUnit.value = settings.temperatureUnit
        if (settings.speedUnit) speedUnit.value = settings.speedUnit
        if (settings.use24Hour !== undefined) use24Hour.value = settings.use24Hour
        if (settings.highContrast !== undefined) highContrast.value = settings.highContrast
        if (settings.sonificationEnabled !== undefined) sonificationEnabled.value = settings.sonificationEnabled
        if (settings.ambientAudioEnabled !== undefined) ambientAudioEnabled.value = settings.ambientAudioEnabled
        if (settings.ambientVolume !== undefined) ambientVolume.value = settings.ambientVolume
        if (settings.hapticsEnabled !== undefined) hapticsEnabled.value = settings.hapticsEnabled
      } catch {
        // Use defaults
      }
    }
    
    // Apply theme on init
    applyTheme()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }
  
  return {
    // State
    theme,
    reducedMotion,
    temperatureUnit,
    speedUnit,
    use24Hour,
    highContrast,
    sonificationEnabled,
    ambientAudioEnabled,
    ambientVolume,
    hapticsEnabled,
    autoRefresh,
    refreshInterval,
    isDrawerOpen,
    
    // Getters
    effectiveTheme,
    prefersReducedMotion,
    
    // Actions
    setTheme,
    toggleTheme,
    cycleTheme,
    setTemperatureUnit,
    setSpeedUnit,
    toggleReducedMotion,
    toggleHighContrast,
    toggleSonification,
    toggleAmbientAudio,
    setAmbientVolume,
    toggleHaptics,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    applyTheme,
    init
  }
})
