<script setup lang="ts">
import { computed } from 'vue'
import { MapPin } from 'lucide-vue-next'
import { useWeatherStore, useLocationStore, useSettingsStore } from '@/stores'
import { formatTemperature } from '@/utils/formatters'
import { getWeatherDescription, getWeatherIcon } from '@/utils/weatherCodes'
import AnimatedNumber from '@/components/ui/AnimatedNumber.vue'
import WeatherIcon from '@/components/ui/WeatherIcon.vue'

const weatherStore = useWeatherStore()
const locationStore = useLocationStore()
const settingsStore = useSettingsStore()

const current = computed(() => weatherStore.current)

const temperature = computed(() => {
  if (!current.value) return 0
  return settingsStore.temperatureUnit === 'fahrenheit'
    ? (current.value.temperature * 9/5) + 32
    : current.value.temperature
})

const feelsLike = computed(() => {
  if (!current.value) return ''
  return formatTemperature(
    current.value.feelsLike,
    settingsStore.temperatureUnit
  )
})

const condition = computed(() => {
  if (!current.value) return ''
  return getWeatherDescription(current.value.weatherCode)
})

const iconName = computed(() => {
  if (!current.value) return 'Cloud'
  return getWeatherIcon(current.value.weatherCode, current.value.isDay)
})

const isDay = computed(() => current.value?.isDay ?? true)
</script>

<template>
  <section 
    v-if="current"
    class="current-weather"
    aria-labelledby="current-weather-heading"
  >
    <!-- Location -->
    <div class="flex items-center gap-2 mb-4">
      <MapPin class="w-4 h-4 text-accent" aria-hidden="true" />
      <span 
        class="text-xs font-bold uppercase tracking-[0.2em]"
        style="color: var(--text-muted)"
      >
        {{ locationStore.cityDisplayName }}
      </span>
    </div>
    
    <h2 id="current-weather-heading" class="sr-only">Current Weather</h2>
    
    <!-- Main temperature display -->
    <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
      <!-- Temperature -->
      <div 
        class="temperature"
        :class="{ 'animate-text-shiver': (current?.windSpeed ?? 0) > 20 }"
      >
        <span class="font-display text-hero font-black tracking-tight leading-none" style="color: var(--text-primary)">
          <AnimatedNumber :value="Math.round(temperature)" />
        </span>
        <span class="text-4xl md:text-6xl font-display mb-4 md:mb-12" style="color: var(--accent)">
          {{ settingsStore.temperatureUnit === 'celsius' ? '°C' : '°F' }}
        </span>
      </div>
      
      <!-- Condition -->
      <div class="condition pb-4 md:pb-12">
        <div class="flex items-center gap-4 mb-2">
          <WeatherIcon :name="iconName" class="w-12 h-12 md:w-20 md:h-20" style="color: var(--text-primary)" />
          <p 
            class="text-2xl md:text-4xl font-display font-bold italic"
            style="color: var(--text-primary)"
          >
            {{ condition }}
          </p>
        </div>
        <p 
          class="text-sm md:text-base uppercase tracking-widest font-bold"
          style="color: var(--text-muted)"
        >
          Feels like {{ feelsLike }} &middot; {{ isDay ? 'Daytime' : 'Night' }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.temperature {
  display: flex;
  align-items: flex-start;
}
</style>
