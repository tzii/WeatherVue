<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
}

const props = defineProps<Props>()

const uvLevel = computed(() => {
  if (props.value < 3) return { label: 'Low', color: '#10b981' }
  if (props.value < 6) return { label: 'Moderate', color: '#f59e0b' }
  if (props.value < 8) return { label: 'High', color: '#ef4444' }
  if (props.value < 11) return { label: 'Very High', color: '#dc2626' }
  return { label: 'Extreme', color: '#7c3aed' }
})

const rotation = computed(() => {
  // Map 0-12 to -90 to 90 degrees
  const p = Math.min(props.value / 12, 1)
  return -90 + p * 180
})
</script>

<template>
  <div class="uv-gauge flex flex-col items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-6" style="color: var(--text-muted)">
      UV Index
    </h3>
    
    <div class="relative w-32 h-20 overflow-hidden">
      <!-- Gauge Background -->
      <div 
        class="absolute bottom-0 left-0 w-32 h-32 rounded-full border-[12px]"
        style="border-color: var(--border-default); border-bottom-color: transparent;"
      />
      
      <!-- Colored Gauge (approximated with partial borders or multiple segments) -->
      <!-- For simplicity, we'll use a single color based on current value -->
      <div 
        class="absolute bottom-0 left-0 w-32 h-32 rounded-full border-[12px] transition-all duration-1000"
        :style="{
          borderColor: uvLevel.color,
          borderBottomColor: 'transparent',
          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
          transform: `rotate(${-90 + (props.value/12)*180}deg)`,
          opacity: 0.3
        }"
      />

      <!-- Needle -->
      <div 
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-14 origin-bottom transition-transform duration-1000"
        :style="{ transform: `translateX(-50%) rotate(${rotation}deg)` }"
      >
        <div class="w-full h-full bg-primary rounded-full" :style="{ backgroundColor: uvLevel.color }" />
      </div>
    </div>
    
    <div class="text-center mt-2">
      <span class="text-2xl font-bold font-display">{{ Math.round(value) }}</span>
      <p class="text-[10px] uppercase font-bold tracking-widest" :style="{ color: uvLevel.color }">
        {{ uvLevel.label }}
      </p>
    </div>
  </div>
</template>
