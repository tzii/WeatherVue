import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { useSettingsStore } from '@/stores/settingsStore'

export const useMagneticEffect = (el: Ref<HTMLElement | null>, strength: number = 0.5) => {
  const settingsStore = useSettingsStore()
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!el.value || settingsStore.prefersReducedMotion) return

    const { left, top, width, height } = el.value.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    const deltaX = Math.floor((e.clientX - centerX) * strength)
    const deltaY = Math.floor((e.clientY - centerY) * strength)

    gsap.to(el.value, {
      x: deltaX,
      y: deltaY,
      duration: 0.5,
      ease: 'power3.out'
    })
  }

  const handleMouseLeave = () => {
    if (!el.value) return
    
    gsap.to(el.value, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  onMounted(() => {
    if (el.value) {
      el.value.addEventListener('mousemove', handleMouseMove)
      el.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (el.value) {
      el.value.removeEventListener('mousemove', handleMouseMove)
      el.value.removeEventListener('mouseleave', handleMouseLeave)
    }
  })
}
