import { CACHE_TTL } from '@/utils/constants'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private prefix = 'weathervue-cache-'
  
  // Get from cache (memory first, then localStorage)
  get<T>(key: string): T | null {
    // Check memory cache
    const memoryEntry = this.cache.get(key)
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data
    }
    
    // Check localStorage
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (stored) {
        const entry: CacheEntry<T> = JSON.parse(stored)
        if (!this.isExpired(entry)) {
          // Restore to memory cache
          this.cache.set(key, entry)
          return entry.data
        } else {
          // Remove expired entry
          localStorage.removeItem(this.prefix + key)
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    
    return null
  }
  
  // Set cache entry
  set<T>(key: string, data: T, ttl: number = CACHE_TTL.weather): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    // Set in memory
    this.cache.set(key, entry)
    
    // Persist to localStorage for longer TTLs
    if (ttl > 60000) { // > 1 minute
      try {
        localStorage.setItem(this.prefix + key, JSON.stringify(entry))
      } catch {
        // localStorage might be full
      }
    }
  }
  
  // Remove cache entry
  remove(key: string): void {
    this.cache.delete(key)
    try {
      localStorage.removeItem(this.prefix + key)
    } catch {
      // Ignore
    }
  }
  
  // Clear all cache
  clear(): void {
    this.cache.clear()
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch {
      // Ignore
    }
  }
  
  // Check if entry is expired
  private isExpired(entry: CacheEntry<any>): boolean {
    if (entry.ttl === Infinity) return false
    return Date.now() - entry.timestamp > entry.ttl
  }
  
  // Generate cache key for weather data
  weatherKey(lat: number, lng: number): string {
    // Round to 2 decimal places for cache efficiency
    const roundedLat = Math.round(lat * 100) / 100
    const roundedLng = Math.round(lng * 100) / 100
    return `weather-${roundedLat}-${roundedLng}`
  }
  
  // Generate cache key for geocoding
  geocodingKey(query: string): string {
    return `geo-${query.toLowerCase().trim()}`
  }
}

export const cache = new CacheService()

// SWR-like hook helper
export const fetchWithCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.weather
): Promise<{ data: T; fromCache: boolean }> => {
  // Check cache first
  const cached = cache.get<T>(key)
  if (cached) {
    return { data: cached, fromCache: true }
  }
  
  // Fetch fresh data
  const data = await fetcher()
  
  // Cache the result
  cache.set(key, data, ttl)
  
  return { data, fromCache: false }
}
