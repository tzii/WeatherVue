import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { City, Coordinates, GeolocationError } from '@/types'
import { DEFAULT_CITIES } from '@/types'

const RECENT_CITIES_KEY = 'weathervue-recent-cities'
const CURRENT_CITY_KEY = 'weathervue-current-city'
const MAX_RECENT_CITIES = 5

export const useLocationStore = defineStore('location', () => {
  // State
  const currentCity = ref<City | null>(null)
  const coordinates = ref<Coordinates | null>(null)
  
  const searchQuery = ref('')
  const searchResults = ref<City[]>([])
  const isSearching = ref(false)
  
  const recentCities = ref<City[]>([])
  const favoriteCities = ref<City[]>([])
  
  const isGeolocating = ref(false)
  const geoError = ref<GeolocationError | null>(null)
  
  // Getters
  const cityDisplayName = computed(() => {
    if (!currentCity.value) return ''
    return `${currentCity.value.name}, ${currentCity.value.country}`
  })
  
  const hasLocation = computed(() => currentCity.value !== null)
  
  const defaultCities = computed(() => DEFAULT_CITIES)
  
  // Actions
  const setCurrentCity = (city: City) => {
    currentCity.value = city
    coordinates.value = {
      latitude: city.latitude,
      longitude: city.longitude
    }
    
    // Add to recent cities
    addToRecentCities(city)
    
    // Persist
    localStorage.setItem(CURRENT_CITY_KEY, JSON.stringify(city))
  }
  
  const setCoordinates = (coords: Coordinates) => {
    coordinates.value = coords
  }
  
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }
  
  const setSearchResults = (results: City[]) => {
    searchResults.value = results
  }
  
  const setSearching = (searching: boolean) => {
    isSearching.value = searching
  }
  
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    isSearching.value = false
  }
  
  const addToRecentCities = (city: City) => {
    // Remove if already exists
    const filtered = recentCities.value.filter(c => c.id !== city.id)
    
    // Add to front
    recentCities.value = [city, ...filtered].slice(0, MAX_RECENT_CITIES)
    
    // Persist
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities.value))
  }
  
  const removeFromRecentCities = (cityId: string) => {
    recentCities.value = recentCities.value.filter(c => c.id !== cityId)
    localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(recentCities.value))
  }
  
  const clearRecentCities = () => {
    recentCities.value = []
    localStorage.removeItem(RECENT_CITIES_KEY)
  }
  
  const toggleFavorite = (city: City) => {
    const index = favoriteCities.value.findIndex(c => c.id === city.id)
    if (index >= 0) {
      favoriteCities.value.splice(index, 1)
    } else {
      favoriteCities.value.push(city)
    }
  }
  
  const isFavorite = (cityId: string) => {
    return favoriteCities.value.some(c => c.id === cityId)
  }
  
  const setGeolocating = (locating: boolean) => {
    isGeolocating.value = locating
    if (locating) {
      geoError.value = null
    }
  }
  
  const setGeoError = (error: GeolocationError | null) => {
    geoError.value = error
    isGeolocating.value = false
  }
  
  // Initialize from localStorage
  const init = () => {
    // Load recent cities
    const storedRecent = localStorage.getItem(RECENT_CITIES_KEY)
    if (storedRecent) {
      try {
        recentCities.value = JSON.parse(storedRecent)
      } catch {
        recentCities.value = []
      }
    }
    
    // Load current city
    const storedCurrent = localStorage.getItem(CURRENT_CITY_KEY)
    if (storedCurrent) {
      try {
        const city = JSON.parse(storedCurrent) as City
        currentCity.value = city
        coordinates.value = {
          latitude: city.latitude,
          longitude: city.longitude
        }
      } catch {
        // Use default
        setCurrentCity(DEFAULT_CITIES[0])
      }
    }
  }
  
  return {
    // State
    currentCity,
    coordinates,
    searchQuery,
    searchResults,
    isSearching,
    recentCities,
    favoriteCities,
    isGeolocating,
    geoError,
    
    // Getters
    cityDisplayName,
    hasLocation,
    defaultCities,
    
    // Actions
    setCurrentCity,
    setCoordinates,
    setSearchQuery,
    setSearchResults,
    setSearching,
    clearSearch,
    addToRecentCities,
    removeFromRecentCities,
    clearRecentCities,
    toggleFavorite,
    isFavorite,
    setGeolocating,
    setGeoError,
    init
  }
})
