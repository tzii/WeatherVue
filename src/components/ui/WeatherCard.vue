<script setup lang="ts">
import { ref, type Component } from 'vue'
import { useSettingsStore } from '@/stores'

interface Props {
  title: string
  value: string | number
  unit?: string
  icon?: Component
  description?: string
  accent?: string
}

const props = defineProps<Props>()
const settingsStore = useSettingsStore()

const cardRef = ref<HTMLElement | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const isHovered = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value || settingsStore.prefersReducedMotion) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  
  mousePos.value = { x, y }
}

const parallaxStyle = (factor: number) => {
  if (settingsStore.prefersReducedMotion || !isHovered.value) return {}
  
  return {
    transform: `translate(${mousePos.value.x * factor * 20}px, ${mousePos.value.y * factor * 20}px)`,
    transition: 'transform 0.1s ease-out'
  }
}
</script>

<template>
  <div 
    ref="cardRef"
    class="weather-card group relative overflow-hidden rounded-2xl p-6 border transition-all duration-500"
    :style="{
      background: 'var(--bg-card)',
      borderColor: isHovered ? (props.accent || 'var(--accent)') : 'var(--border-default)'
    }"
    @mousemove="handleMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Background Watermark -->
    <div 
      class="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none"
      :style="parallaxStyle(0.5)"
    >
      <component :is="icon" v-if="icon" class="w-48 h-48" />
    </div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-bold uppercase tracking-[0.2em]" style="color: var(--text-muted)">
            {{ title }}
          </h3>
          <component :is="icon" v-if="icon" class="w-4 h-4" :style="{ color: accent || 'var(--accent)' }" />
        </div>
        
        <div class="flex items-baseline" :style="parallaxStyle(1)">
          <span class="font-display text-4xl font-bold">
            {{ value }}
          </span>
          <span v-if="unit" class="ml-1 text-lg font-medium" style="color: var(--text-secondary)">
            {{ unit }}
          </span>
        </div>
      </div>
      
      <p v-if="description" class="mt-4 text-xs" style="color: var(--text-muted)">
        {{ description }}
      </p>
    </div>

    <!-- Border Glow -->
    <div 
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      :style="{
        boxShadow: `inset 0 0 20px ${accent || 'var(--accent)'}20`
      }"
    />
  </div>
</template>

<style scoped>
.weather-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}
</style>
