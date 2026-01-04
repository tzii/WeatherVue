import { watch } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { sonification } from '@/services/sonification'

export const useSonification = () => {
  const settingsStore = useSettingsStore()

  const playTone = (temperature: number) => {
    if (settingsStore.sonificationEnabled) {
      sonification.playTemperatureTone(temperature)
    }
  }

  watch(() => settingsStore.ambientVolume, (val) => {
    sonification.setVolume(val)
  })

  return {
    playTone
  }
}
