import { useSettingsStore } from '@/stores/settingsStore'
import { Haptics } from '@/utils/haptics'

export const useHaptics = () => {
  const settingsStore = useSettingsStore()

  const vibrate = (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection') => {
    if (!settingsStore.hapticsEnabled) return

    switch (pattern) {
      case 'light':
        Haptics.light()
        break
      case 'medium':
        Haptics.medium()
        break
      case 'heavy':
        Haptics.heavy()
        break
      case 'success':
        Haptics.success()
        break
      case 'error':
        Haptics.error()
        break
      case 'selection':
        Haptics.selection()
        break
    }
  }

  return {
    vibrate
  }
}
