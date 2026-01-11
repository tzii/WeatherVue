import type { City, GeocodingResponse, GeocodingResult } from '@/types'
import { API_ENDPOINTS } from '@/utils/constants'

export const searchCities = async (
  query: string,
  count: number = 10,
  language: string = 'en'
): Promise<City[]> => {
  if (!query || query.length < 2) {
    return []
  }
  
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language,
    format: 'json'
  })
  
  const response = await fetch(`${API_ENDPOINTS.GEOCODING}?${params}`)
  
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.statusText}`)
  }
  
  const data: GeocodingResponse = await response.json()
  
  if (!data.results) {
    return []
  }
  
  return data.results.map(transformGeocodingResult)
}

const transformGeocodingResult = (result: GeocodingResult): City => {
  const city: City = {
    id: `${result.id}`,
    name: result.name,
    country: result.country,
    countryCode: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone
  }
  
  if (result.population !== undefined) {
    city.population = result.population
  }
  
  if (result.admin1 !== undefined) {
    city.admin1 = result.admin1
  }
  
  return city
}

// Reverse geocoding (coordinates to city)
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<City | null> => {
  // Open-Meteo doesn't have reverse geocoding
  // Use a simple city name based on coordinates
  // In production, you'd use a service like Nominatim or Google Geocoding
  
  // Attempt to find nearby city
  // This is a workaround - ideally use a proper reverse geocoding API
  try {
    // For now, return a generic location
    return {
      id: `loc-${latitude}-${longitude}`,
      name: 'Current Location',
      country: 'Unknown',
      countryCode: 'XX',
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  } catch {
    return null
  }
}

// Debounce helper for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
