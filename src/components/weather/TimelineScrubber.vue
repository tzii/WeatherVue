<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWeatherStore, useSettingsStore } from '@/stores'
import { formatTime, formatTemperature } from '@/utils/formatters'
import { Haptics } from '@/utils/haptics'
import { sonification } from '@/services/sonification'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

const isDragging = ref(false)
const trackRef = ref<HTMLElement | null>(null)

const position = computed({
  get: () => weatherStore.timelinePosition,
  set: (val) => {
    const oldVal = weatherStore.timelinePosition
    weatherStore.setTimelinePosition(val)
    
    // Provide haptic and audio feedback for every 1-hour step change
    const totalHours = weatherStore.hourly.length - 1
    if (totalHours > 0) {
      const oldHour = Math.round(oldVal * totalHours)
      const newHour = Math.round(val * totalHours)
      
      if (oldHour !== newHour) {
        if (settingsStore.hapticsEnabled) {
          Haptics.selection()
        }
        
        if (settingsStore.sonificationEnabled) {
          const hourData = weatherStore.hourly[newHour]
          if (hourData) {
            sonification.playTemperatureTone(hourData.temperature)
          }
        }
      }
    }
  }
})

// Time display for current position
const timeAtPosition = computed(() => {
  if (weatherStore.hourly.length === 0) return ''
  
  const index = Math.floor(position.value * (weatherStore.hourly.length - 1))
  const hour = weatherStore.hourly[index]
  if (!hour) return ''
  
  return formatTime(hour.time, settingsStore.use24Hour)
})

// Temperature at current position
const tempAtPosition = computed(() => {
  const interpolated = weatherStore.interpolatedWeather
  if (!interpolated) return ''
  
  return formatTemperature(
    interpolated.temperature,
    settingsStore.temperatureUnit,
    false
  )
})

// Handle drag
const updatePosition = (clientX: number) => {
  if (!trackRef.value) return
  
  const rect = trackRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  const newPosition = Math.max(0, Math.min(1, x / rect.width))
  position.value = newPosition
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  updatePosition(e.clientX)
  
  const handleMouseMove = (e: MouseEvent) => {
    updatePosition(e.clientX)
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  const touch = e.touches[0]
  if (touch) {
    updatePosition(touch.clientX)
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (isDragging.value) {
    const touch = e.touches[0]
    if (touch) {
      updatePosition(touch.clientX)
    }
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  const step = 1 / (weatherStore.hourly.length - 1)
  
  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault()
      position.value = Math.max(0, position.value - step)
      break
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault()
      position.value = Math.min(1, position.value + step)
      break
    case 'Home':
      e.preventDefault()
      position.value = 0
      break
    case 'End':
      e.preventDefault()
      position.value = 1
      break
  }
}

// Reset to current time
const resetToNow = () => {
  weatherStore.resetTimelineToNow()
}
</script>

<template>
  <section 
    class="timeline-scrubber"
    aria-labelledby="timeline-heading"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 
        id="timeline-heading"
        class="text-xs font-bold uppercase tracking-[0.2em]"
        style="color: var(--accent)"
      >
        Timeline
      </h3>
      
      <button
        @click="resetToNow"
        class="text-xs uppercase tracking-wider hover:text-accent transition-colors"
        style="color: var(--text-muted)"
      >
        Reset to Now
      </button>
    </div>
    
    <!-- Current time/temp display -->
    <div class="text-center mb-6">
      <span 
        class="font-display text-5xl font-bold"
        style="color: var(--text-primary)"
      >
        {{ tempAtPosition }}°
      </span>
      <span 
        class="block text-sm mt-1"
        style="color: var(--text-muted)"
      >
        {{ timeAtPosition }}
      </span>
    </div>
    
    <!-- Track -->
    <div 
      ref="trackRef"
      class="track relative h-12 cursor-pointer"
      role="slider"
      :aria-valuenow="Math.round(position * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Timeline scrubber"
      tabindex="0"
      @mousedown="handleMouseDown"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend="handleTouchEnd"
      @keydown="handleKeydown"
    >
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-yellow-500/20 to-orange-500/20 rounded" />
      
      <!-- Progress -->
      <div 
        class="absolute inset-y-0 left-0 bg-accent/30 rounded-l"
        :style="{ width: `${position * 100}%` }"
      />
      
      <!-- Thumb -->
      <div 
        class="thumb absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-accent rounded-full shadow-lg transition-transform"
        :class="{ 'scale-125': isDragging }"
        :style="{ left: `${position * 100}%` }"
      >
        <div class="absolute inset-0 rounded-full bg-white/30 animate-ping" v-if="isDragging" />
      </div>
      
      <!-- Time markers -->
      <div class="absolute -bottom-6 left-0 right-0 flex justify-between text-xs" style="color: var(--text-muted)">
        <span>Now</span>
        <span>+12h</span>
        <span>+24h</span>
        <span>+36h</span>
        <span>+48h</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.track:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

.thumb {
  cursor: grab;
}

.thumb:active {
  cursor: grabbing;
}
</style>
