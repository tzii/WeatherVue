// Location Types

export interface City {
  id: string
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
  population?: number
  admin1?: string // State/Province
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export type Location = Coordinates

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  feature_code: string
  country_code: string
  country: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
  timezone: string
  population?: number
  postcodes?: string[]
  country_id: number
  admin1_id?: number
}

export interface GeocodingResponse {
  results?: GeocodingResult[]
  generationtime_ms: number
}

export interface GeolocationError {
  code: GeolocationPositionError['code']
  message: string
}

// Default cities for quick selection
export const DEFAULT_CITIES: City[] = [
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    latitude: 41.9028,
    longitude: 12.4964,
    timezone: 'Europe/Rome'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney'
  }
]
