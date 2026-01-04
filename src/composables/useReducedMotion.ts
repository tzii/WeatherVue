import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export const useReducedMotion = () => {
  const settingsStore = useSettingsStore()
  const systemPrefersReducedMotion = ref(false)

  const updatePreference = (e: MediaQueryListEvent | MediaQueryList) => {
    systemPrefersReducedMotion.value = e.matches
  }

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updatePreference(mediaQuery)
    mediaQuery.addEventListener('change', updatePreference)
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.removeEventListener('change', updatePreference)
  })

  return {
    isReduced: settingsStore.prefersReducedMotion || systemPrefersReducedMotion
  }
}
