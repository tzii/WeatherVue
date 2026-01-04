<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWeatherStore, useSettingsStore } from '@/stores'
import { formatTemperature, formatTime } from '@/utils/formatters'
import { getWeatherIcon } from '@/utils/weatherCodes'
import WeatherIcon from '@/components/ui/WeatherIcon.vue'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

const scrollContainer = ref<HTMLElement | null>(null)

// Get next 24 hours
const hours = computed(() => {
  return weatherStore.hourly.slice(0, 24)
})

// Find current hour index
const currentHourIndex = computed(() => {
  const now = new Date()
  return hours.value.findIndex(h => {
    const hourTime = new Date(h.time)
    return hourTime.getHours() === now.getHours()
  })
})
</script>

<template>
  <section 
    class="hourly-forecast"
    aria-labelledby="hourly-heading"
  >
    <h3 
      id="hourly-heading"
      class="text-xs font-bold uppercase tracking-[0.2em] mb-4"
      style="color: var(--accent)"
    >
      Hourly Forecast
    </h3>
    
    <div 
      ref="scrollContainer"
      class="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth snap-x snap-mandatory"
      role="list"
      aria-label="24-hour forecast"
    >
      <div
        v-for="(hour, index) in hours"
        :key="hour.time"
        class="hour-card flex-shrink-0 snap-start"
        :class="{ 'current': index === currentHourIndex }"
        role="listitem"
        :aria-current="index === currentHourIndex ? 'time' : undefined"
      >
        <!-- Time -->
        <span class="time">
          {{ index === currentHourIndex ? 'Now' : formatTime(hour.time, settingsStore.use24Hour) }}
        </span>
        
        <!-- Icon -->
        <WeatherIcon 
          :name="getWeatherIcon(hour.weatherCode, hour.isDay)"
          class="w-8 h-8 my-3"
        />
        
        <!-- Temperature -->
        <span class="temp">
          {{ formatTemperature(hour.temperature, settingsStore.temperatureUnit, false) }}°
        </span>
        
        <!-- Precipitation -->
        <span 
          v-if="hour.precipitationProbability > 0"
          class="precip"
        >
          {{ hour.precipitationProbability }}%
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hour-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-width: 80px;
  border: 1px solid var(--border-default);
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.hour-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.hour-card.current {
  border-color: var(--accent);
  background: var(--accent);
}

.hour-card.current .time,
.hour-card.current .temp {
  color: white;
}

.time {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.temp {
  font-family: theme('fontFamily.display');
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.precip {
  font-size: 0.65rem;
  font-weight: 600;
  color: #60a5fa;
  margin-top: 0.25rem;
}

/* Hide scrollbar but keep functionality */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
