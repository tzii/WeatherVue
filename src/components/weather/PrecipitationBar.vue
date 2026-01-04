<script setup lang="ts">
import { computed } from 'vue'
import { Droplets } from 'lucide-vue-next'

interface Props {
  probability: number
  amount?: number
}

const props = defineProps<Props>()

const height = computed(() => `${props.probability}%`)
</script>

<template>
  <div class="precip-bar flex flex-col items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-6" style="color: var(--text-muted)">
      Precipitation
    </h3>
    
    <div class="relative w-12 h-32 bg-card rounded-xl border border-default overflow-hidden">
      <!-- Grid lines -->
      <div class="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
        <div class="border-t border-muted w-full" />
        <div class="border-t border-muted w-full" />
        <div class="border-t border-muted w-full" />
      </div>
      
      <!-- Fill -->
      <div 
        class="absolute bottom-0 left-0 right-0 bg-accent transition-all duration-1000 ease-out flex items-start justify-center pt-2"
        :style="{ height, background: 'linear-gradient(to top, var(--accent), var(--accent-light))' }"
      >
        <Droplets class="w-3 h-3 text-white opacity-50" />
      </div>
    </div>
    
    <div class="text-center mt-4">
      <span class="text-xl font-bold font-display">{{ Math.round(probability) }}%</span>
      <p v-if="amount !== undefined" class="text-[10px] uppercase font-bold tracking-widest text-muted">
        {{ amount }} mm
      </p>
    </div>
  </div>
</template>

<style scoped>
.bg-card {
  background-color: var(--bg-card);
}
.border-default {
  border-color: var(--border-default);
}
.text-muted {
  color: var(--text-muted);
}
.border-muted {
  border-color: var(--text-muted);
}
</style>
