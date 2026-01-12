<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { formatTime } from '@/utils/formatters'
import { useSettingsStore } from '@/stores'

interface Props {
  sunrise: string
  sunset: string
  currentTime?: string
}

const props = defineProps<Props>()
const settingsStore = useSettingsStore()

const sunriseTime = computed(() => new Date(props.sunrise))
const sunsetTime = computed(() => new Date(props.sunset))
const now = computed(() => (props.currentTime ? new Date(props.currentTime) : new Date()))

const progress = computed(() => {
  const total = sunsetTime.value.getTime() - sunriseTime.value.getTime()
  const elapsed = now.value.getTime() - sunriseTime.value.getTime()
  return Math.max(0, Math.min(1, elapsed / total))
})

const isDaylight = computed(() => {
  return now.value >= sunriseTime.value && now.value <= sunsetTime.value
})

const formattedSunrise = computed(() => formatTime(props.sunrise, settingsStore.use24Hour))
const formattedSunset = computed(() => formatTime(props.sunset, settingsStore.use24Hour))

// Path for the arc
const arcPath = 'M 10,90 A 80,80 0 0 1 170,90'

// Calculate point on arc
const getPointOnArc = (p: number) => {
  const angle = Math.PI + p * Math.PI
  const radius = 80
  const centerX = 90
  const centerY = 90
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

const sunPos = computed(() => getPointOnArc(progress.value))
</script>

<template>
  <div class="sunrise-sunset-arc flex flex-col items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-6" style="color: var(--text-muted)">
      Sunrise & Sunset
    </h3>

    <div class="relative w-full max-w-[200px] aspect-[4/3]">
      <svg viewBox="0 0 180 130" class="w-full h-full">
        <!-- Background Arc -->
        <path
          :d="arcPath"
          fill="none"
          stroke="var(--border-default)"
          stroke-width="2"
          stroke-dasharray="4,4"
        />

        <!-- Progress Arc -->
        <path
          v-if="isDaylight"
          :d="arcPath"
          fill="none"
          stroke="var(--accent)"
          stroke-width="3"
          :stroke-dasharray="`${progress * 251.3} 251.3`"
        />

        <!-- Sun/Moon Icon on Arc -->
        <g
          :transform="`translate(${sunPos.x - 8}, ${sunPos.y - 8})`"
          class="transition-all duration-1000"
        >
          <circle
            cx="8"
            cy="8"
            r="10"
            :fill="isDaylight ? 'var(--accent)' : 'var(--text-muted)'"
            opacity="0.2"
          />
          <Sun v-if="isDaylight" class="w-4 h-4" style="color: var(--accent)" />
          <Moon v-else class="w-4 h-4" style="color: var(--text-muted)" />
        </g>

        <!-- Horizon Line -->
        <line x1="0" y1="90" x2="180" y2="90" stroke="var(--border-default)" stroke-width="1" />
      </svg>

      <!-- Time Labels -->
      <div class="absolute bottom-0 left-0 flex flex-col items-start">
        <span class="text-[10px] uppercase font-bold text-muted">Sunrise</span>
        <span class="text-xs font-bold">{{ formattedSunrise }}</span>
      </div>

      <div class="absolute bottom-0 right-0 flex flex-col items-end">
        <span class="text-[10px] uppercase font-bold text-muted">Sunset</span>
        <span class="text-xs font-bold">{{ formattedSunset }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-muted {
  color: var(--text-muted);
}
</style>
