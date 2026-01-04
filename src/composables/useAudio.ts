import { onMounted, watch } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export const useAudio = (audioUrl: string) => {
  const settingsStore = useSettingsStore()
  let audio: HTMLAudioElement | null = null

  const initAudio = () => {
    if (!audio) {
      audio = new Audio(audioUrl)
      audio.loop = true
      audio.volume = settingsStore.ambientVolume / 100
    }
  }

  const play = () => {
    if (settingsStore.ambientAudioEnabled && audio) {
      audio.play().catch(() => {
        // Autoplay policy might block this
      })
    }
  }

  const pause = () => {
    if (audio) {
      audio.pause()
    }
  }

  watch(() => settingsStore.ambientAudioEnabled, (enabled) => {
    if (enabled) play()
    else pause()
  })

  watch(() => settingsStore.ambientVolume, (volume) => {
    if (audio) {
      audio.volume = volume / 100
    }
  })

  onMounted(() => {
    initAudio()
    if (settingsStore.ambientAudioEnabled) {
      play()
    }
  })

  return {
    play,
    pause
  }
}
