<script setup lang="ts">
import { computed } from 'vue'
import { Wind } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores'

interface Props {
  speed: number
  direction: number
}

const props = defineProps<Props>()
const settingsStore = useSettingsStore()

const rotationStyle = computed(() => ({
  transform: `rotate(${props.direction}deg)`
}))
</script>

<template>
  <div class="wind-compass flex flex-col items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-6" style="color: var(--text-muted)">
      Wind
    </h3>
    
    <div class="relative w-32 h-32 flex items-center justify-center rounded-full border border-dashed" style="border-color: var(--border-default)">
      <!-- Direction arrow -->
      <div 
        class="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
        :style="rotationStyle"
      >
        <div class="w-1 h-16 bg-accent rounded-full relative">
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-accent" />
        </div>
      </div>
      
      <!-- Center display -->
      <div class="z-10 bg-body rounded-full p-2 text-center">
        <Wind class="w-5 h-5 mx-auto mb-1" style="color: var(--text-secondary)" />
        <span class="text-xl font-bold font-display leading-none block">
          {{ Math.round(speed) }}
        </span>
        <span class="text-[10px] uppercase tracking-tighter" style="color: var(--text-muted)">
          {{ settingsStore.speedUnit }}
        </span>
      </div>
      
      <!-- Compass points -->
      <span class="absolute top-1 text-[10px] font-bold" style="color: var(--text-muted)">N</span>
      <span class="absolute right-1 text-[10px] font-bold" style="color: var(--text-muted)">E</span>
      <span class="absolute bottom-1 text-[10px] font-bold" style="color: var(--text-muted)">S</span>
      <span class="absolute left-1 text-[10px] font-bold" style="color: var(--text-muted)">W</span>
    </div>
  </div>
</template>

<style scoped>
.bg-body {
  background-color: var(--bg-body);
}
</style>
