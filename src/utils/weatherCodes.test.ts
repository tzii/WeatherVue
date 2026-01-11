 import { describe, it, expect } from 'vitest'
 import { getWeatherType, interpolateValue } from './weatherCodes'
 
 describe('getWeatherType', () => {
   it('should return clear for weather code 0', () => {
     expect(getWeatherType(0)).toBe('clear')
   })
 
   it('should return clear for weather code 1', () => {
     expect(getWeatherType(1)).toBe('clear')
   })
 
   it('should return cloudy for weather codes 2-3', () => {
     expect(getWeatherType(2)).toBe('cloudy')
     expect(getWeatherType(3)).toBe('cloudy')
   })
 
   it('should return fog for weather codes 45 and 48', () => {
     expect(getWeatherType(45)).toBe('fog')
     expect(getWeatherType(48)).toBe('fog')
   })
 
   it('should return rain for rain weather codes', () => {
     expect(getWeatherType(61)).toBe('rain')
     expect(getWeatherType(63)).toBe('rain')
     expect(getWeatherType(65)).toBe('rain')
   })
 
   it('should return snow for snow weather codes', () => {
     expect(getWeatherType(71)).toBe('snow')
     expect(getWeatherType(73)).toBe('snow')
     expect(getWeatherType(75)).toBe('snow')
   })
 
   it('should return storm for thunderstorm codes', () => {
     expect(getWeatherType(95)).toBe('storm')
     expect(getWeatherType(96)).toBe('storm')
     expect(getWeatherType(99)).toBe('storm')
   })
 })
 
 describe('interpolateValue', () => {
   it('should return start value when fraction is 0', () => {
     expect(interpolateValue(10, 20, 0)).toBe(10)
   })
 
   it('should return end value when fraction is 1', () => {
     expect(interpolateValue(10, 20, 1)).toBe(20)
   })
 
   it('should return midpoint when fraction is 0.5', () => {
     expect(interpolateValue(10, 20, 0.5)).toBe(15)
   })
 
   it('should handle negative values', () => {
     expect(interpolateValue(-10, 10, 0.5)).toBe(0)
   })
 })
