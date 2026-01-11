 import { describe, it, expect, beforeEach } from 'vitest'
 import { cache } from './cache'
 
 describe('cache', () => {
   beforeEach(() => {
     cache.clear()
   })
 
   it('should store and retrieve values', () => {
     cache.set('test-key', { value: 42 }, 60000)
     expect(cache.get('test-key')).toEqual({ value: 42 })
   })
 
   it('should return undefined for non-existent keys', () => {
    expect(cache.get('non-existent')).toBeNull()
   })
 
   it('should generate consistent weather keys', () => {
     const key1 = cache.weatherKey(40.7128, -74.006)
     const key2 = cache.weatherKey(40.7128, -74.006)
     expect(key1).toBe(key2)
   })
 
   it('should generate different keys for different locations', () => {
     const nyKey = cache.weatherKey(40.7128, -74.006)
     const laKey = cache.weatherKey(34.0522, -118.2437)
     expect(nyKey).not.toBe(laKey)
   })
 })
