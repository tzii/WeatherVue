import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

export const useParallax = (factor = 0.05) => {
  const settingsStore = useSettingsStore()
  const mouseX = ref(0)
  const mouseY = ref(0)
  
  const handleMouseMove = (event: MouseEvent) => {
    if (settingsStore.prefersReducedMotion) return
    
    const { innerWidth, innerHeight } = window
    mouseX.value = (event.clientX - innerWidth / 2) * factor
    mouseY.value = (event.clientY - innerHeight / 2) * factor
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    mouseX,
    mouseY
  }
}
