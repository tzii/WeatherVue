import { ref } from 'vue'
import type { Location } from '@/types'

export const useGeolocation = () => {
  const coords = ref<Location | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const supported = 'geolocation' in navigator

  let watcherId: number | null = null

  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })
    })
  }

  const updateLocation = async () => {
    if (!supported) {
      error.value = 'Geolocation is not supported by your browser'
      return
    }

    loading.value = true
    error.value = null

    try {
      const position = await getPosition()
      coords.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to get location'
    } finally {
      loading.value = false
    }
  }

  const watchLocation = () => {
    if (!supported || watcherId !== null) return

    watcherId = navigator.geolocation.watchPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        error.value = null
      },
      (err) => {
        error.value = err.message
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const stopWatching = () => {
    if (watcherId !== null) {
      navigator.geolocation.clearWatch(watcherId)
      watcherId = null
    }
  }

  return {
    coords,
    error,
    loading,
    supported,
    updateLocation,
    watchLocation,
    stopWatching
  }
}
