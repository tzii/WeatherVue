<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores'
import { Haptics } from '@/utils/haptics'

interface Props {
  strength?: number
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  strength: 0.3,
  radius: 100
})

const settingsStore = useSettingsStore()
const buttonRef = ref<HTMLElement | null>(null)
const transform = ref({ x: 0, y: 0 })

let animationFrame: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  if (!buttonRef.value || settingsStore.prefersReducedMotion) return
  
  const rect = buttonRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
  
  if (distance < props.radius) {
    const strength = 1 - (distance / props.radius)
    const maxMove = 15
    
    transform.value = {
      x: Math.min(Math.max(deltaX * strength * props.strength, -maxMove), maxMove),
      y: Math.min(Math.max(deltaY * strength * props.strength, -maxMove), maxMove)
    }
  }
}

const handleMouseLeave = () => {
  if (settingsStore.prefersReducedMotion) return
  
  // Animate back to center with spring effect
  const startX = transform.value.x
  const startY = transform.value.y
  const duration = 500
  const startTime = performance.now()
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Spring easing
    const eased = 1 - Math.pow(1 - progress, 3)
    
    transform.value = {
      x: startX * (1 - eased),
      y: startY * (1 - eased)
    }
    
    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }
  
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

const handleClick = () => {
  if (settingsStore.hapticsEnabled) {
    Haptics.light()
  }
}
</script>

<template>
  <button
    ref="buttonRef"
    class="magnetic-button"
    :style="{
      transform: `translate(${transform.x}px, ${transform.y}px)`
    }"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.magnetic-button {
  transition: box-shadow 0.2s ease;
}

.magnetic-button:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
