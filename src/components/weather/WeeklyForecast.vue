<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore, useSettingsStore } from '@/stores'
import { formatTemperature, formatDate } from '@/utils/formatters'
import { getWeatherIcon } from '@/utils/weatherCodes'
import WeatherIcon from '@/components/ui/WeatherIcon.vue'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

const days = computed(() => weatherStore.daily)

// Get temperature range for the week (for bar visualization)
const tempRange = computed(() => {
  if (days.value.length === 0) return { min: 0, max: 30 }
  
  const allTemps = days.value.flatMap(d => [d.temperatureMin, d.temperatureMax])
  return {
    min: Math.min(...allTemps),
    max: Math.max(...allTemps)
  }
})

// Calculate bar position for a temperature
const getTempPosition = (temp: number) => {
  const { min, max } = tempRange.value
  const range = max - min || 1
  return ((temp - min) / range) * 100
}
</script>

<template>
  <section 
    class="weekly-forecast"
    aria-labelledby="weekly-heading"
  >
    <h3 
      id="weekly-heading"
      class="text-xs font-bold uppercase tracking-[0.2em] mb-4"
      style="color: var(--accent)"
    >
      7-Day Forecast
    </h3>
    
    <div class="space-y-2" role="list" aria-label="7-day forecast">
      <div
        v-for="(day, index) in days"
        :key="day.date"
        class="day-row"
        :class="{ 'today': index === 0 }"
        role="listitem"
        :aria-label="`${index === 0 ? 'Today' : formatDate(day.date, 'long')}: Low ${formatTemperature(day.temperatureMin, settingsStore.temperatureUnit)}, High ${formatTemperature(day.temperatureMax, settingsStore.temperatureUnit)}`"
      >
        <!-- Day name -->
        <div class="day-name">
          {{ index === 0 ? 'Today' : formatDate(day.date, 'short') }}
        </div>
        
        <!-- Weather icon -->
        <div class="day-icon">
          <WeatherIcon 
            :name="getWeatherIcon(day.weatherCode, true)"
            class="w-6 h-6"
          />
        </div>
        
        <!-- Precipitation probability -->
        <div class="day-precip">
          <span v-if="day.precipitationProbabilityMax > 0" class="text-blue-400">
            {{ day.precipitationProbabilityMax }}%
          </span>
        </div>
        
        <!-- Temperature bar -->
        <div class="day-temp-bar">
          <!-- Min temp -->
          <span class="temp-min">
            {{ formatTemperature(day.temperatureMin, settingsStore.temperatureUnit, false) }}°
          </span>
          
          <!-- Bar -->
          <div class="bar-container">
            <div 
              class="bar"
              :style="{
                left: `${getTempPosition(day.temperatureMin)}%`,
                right: `${100 - getTempPosition(day.temperatureMax)}%`
              }"
            />
          </div>
          
          <!-- Max temp -->
          <span class="temp-max">
            {{ formatTemperature(day.temperatureMax, settingsStore.temperatureUnit, false) }}°
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.day-row {
  display: grid;
  grid-template-columns: 80px 40px 50px 1fr;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-default);
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.day-row:hover {
  border-color: var(--accent);
}

.day-row.today {
  border-color: var(--accent);
}

.day-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.day-icon {
  display: flex;
  justify-content: center;
  color: var(--text-primary);
}

.day-precip {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.day-temp-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.temp-min,
.temp-max {
  font-family: theme('fontFamily.display');
  font-size: 0.875rem;
  font-weight: 500;
  width: 32px;
  text-align: center;
}

.temp-min {
  color: var(--text-muted);
}

.temp-max {
  color: var(--text-primary);
}

.bar-container {
  flex: 1;
  height: 4px;
  background: var(--border-default);
  border-radius: 2px;
  position: relative;
}

.bar {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  background: linear-gradient(90deg, #60a5fa, #fcd34d, #f97316);
}
</style>
