<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000,
  decimals: 0,
  prefix: '',
  suffix: ''
})

const displayValue = ref(props.value)
const isAnimating = ref(false)

// Easing function (ease out expo)
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// Animate when value changes
watch(() => props.value, (newVal, oldVal) => {
  if (oldVal === undefined) {
    displayValue.value = newVal
    return
  }
  
  const startValue = displayValue.value
  const startTime = performance.now()
  isAnimating.value = true
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const easedProgress = easeOutExpo(progress)
    
    displayValue.value = startValue + (newVal - startValue) * easedProgress
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayValue.value = newVal
      isAnimating.value = false
    }
  }
  
  requestAnimationFrame(animate)
}, { immediate: true })

const formattedValue = computed(() => {
  const val = props.decimals > 0 
    ? displayValue.value.toFixed(props.decimals)
    : Math.round(displayValue.value)
  return `${props.prefix}${val}${props.suffix}`
})
</script>

<template>
  <span 
    class="animated-number"
    :class="{ 'animating': isAnimating }"
    :aria-label="`${prefix}${value}${suffix}`"
  >
    {{ formattedValue }}
  </span>
</template>

<style scoped>
.animated-number {
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
