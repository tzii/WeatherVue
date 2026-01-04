import type { TemperatureUnit, SpeedUnit } from '@/types'

// Temperature formatting
export const formatTemperature = (
  celsius: number, 
  unit: TemperatureUnit = 'celsius',
  showUnit: boolean = true
): string => {
  let value: number
  let symbol: string
  
  if (unit === 'fahrenheit') {
    value = (celsius * 9/5) + 32
    symbol = '°F'
  } else {
    value = celsius
    symbol = '°C'
  }
  
  const rounded = Math.round(value)
  return showUnit ? `${rounded}${symbol}` : `${rounded}`
}

// Wind speed formatting
export const formatWindSpeed = (
  kmh: number,
  unit: SpeedUnit = 'kmh',
  showUnit: boolean = true
): string => {
  let value: number
  let symbol: string
  
  switch (unit) {
    case 'mph':
      value = kmh * 0.621371
      symbol = 'mph'
      break
    case 'ms':
      value = kmh / 3.6
      symbol = 'm/s'
      break
    default:
      value = kmh
      symbol = 'km/h'
  }
  
  const rounded = Math.round(value)
  return showUnit ? `${rounded} ${symbol}` : `${rounded}`
}

export const formatSpeed = formatWindSpeed

// Wind direction to cardinal
export const formatWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Percentage formatting
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`
}

// Pressure formatting
export const formatPressure = (hPa: number, unit: 'hpa' | 'inhg' | 'mmhg' = 'hpa'): string => {
  switch (unit) {
    case 'inhg':
      return `${(hPa * 0.02953).toFixed(2)} inHg`
    case 'mmhg':
      return `${Math.round(hPa * 0.750062)} mmHg`
    default:
      return `${Math.round(hPa)} hPa`
  }
}

// Time formatting
export const formatTime = (
  date: Date | string, 
  use24Hour: boolean = true,
  timezone?: string
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
    ...(timezone && { timeZone: timezone })
  }
  
  return d.toLocaleTimeString('en-US', options)
}

// Date formatting
export const formatDate = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'medium',
  timezone?: string
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    ...(timezone && { timeZone: timezone })
  }
  
  switch (format) {
    case 'short':
      options.weekday = 'short'
      break
    case 'long':
      options.weekday = 'long'
      options.month = 'long'
      options.day = 'numeric'
      break
    default:
      options.weekday = 'short'
      options.month = 'short'
      options.day = 'numeric'
  }
  
  return d.toLocaleDateString('en-US', options)
}

// Relative time (e.g., "5 minutes ago")
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// UV Index description
export const formatUVIndex = (uv: number): { value: number; level: string; color: string } => {
  const value = Math.round(uv)
  
  if (value <= 2) return { value, level: 'Low', color: '#22c55e' }
  if (value <= 5) return { value, level: 'Moderate', color: '#eab308' }
  if (value <= 7) return { value, level: 'High', color: '#f97316' }
  if (value <= 10) return { value, level: 'Very High', color: '#ef4444' }
  return { value, level: 'Extreme', color: '#a855f7' }
}
