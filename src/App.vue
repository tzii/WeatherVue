<script setup lang="ts">
import { onMounted, watch, computed, ref } from "vue";
import { useSettingsStore, useLocationStore, useWeatherStore } from "@/stores";
import { useTheme } from "@/composables/useTheme";
import { useWeather } from "@/composables/useWeather";
import gsap from "gsap";

// Components
import SplashScreen from "@/components/layout/SplashScreen.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import SettingsDrawer from "@/components/layout/SettingsDrawer.vue";
import WeatherCanvas from "@/components/canvas/WeatherCanvas.vue";
import CurrentWeather from "@/components/weather/CurrentWeather.vue";
import HourlyForecast from "@/components/weather/HourlyForecast.vue";
import WeeklyForecast from "@/components/weather/WeeklyForecast.vue";
import TimelineScrubber from "@/components/weather/TimelineScrubber.vue";
import TemperatureGraph from "@/components/weather/TemperatureGraph.vue";
import WindCompass from "@/components/weather/WindCompass.vue";
import SunriseSunsetArc from "@/components/weather/SunriseSunsetArc.vue";
import UVIndexGauge from "@/components/weather/UVIndexGauge.vue";
import PrecipitationBar from "@/components/weather/PrecipitationBar.vue";
import CitySearch from "@/components/search/CitySearch.vue";
import WeatherCard from "@/components/ui/WeatherCard.vue";

// Lucide Icons
import { Droplets, Cloud, Eye, Gauge } from "lucide-vue-next";

// Stores
const settingsStore = useSettingsStore();
const locationStore = useLocationStore();
const weatherStore = useWeatherStore();

// Composables
useTheme();
useWeather(computed(() => locationStore.coordinates));

// Computed
const showSplash = computed(
  () => !weatherStore.hasData && weatherStore.isLoading,
);
const weather = computed(
  () => weatherStore.interpolatedWeather || weatherStore.current,
);
const daily = computed(() => weatherStore.daily[0]);

const mainContentRef = ref<HTMLElement | null>(null);

// Watch for city changes to trigger transition
watch(
  () => locationStore.currentCity,
  () => {
    if (mainContentRef.value && !settingsStore.prefersReducedMotion) {
      gsap.fromTo(
        mainContentRef.value,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "expo.out" },
      );
    } else if (mainContentRef.value) {
      // Instant switch for reduced motion
      gsap.set(mainContentRef.value, { opacity: 1, scale: 1 });
    }
  },
);

// Initialize on mount
onMounted(() => {
  settingsStore.init();
  locationStore.init();
});
</script>

<template>
  <div class="app min-h-screen relative overflow-hidden">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link sr-only-focusable">
      Skip to main content
    </a>

    <!-- WebGL Background -->
    <WeatherCanvas class="fixed inset-0 z-0" />

    <!-- Splash Screen -->
    <SplashScreen v-if="showSplash" />

    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main
      id="main-content"
      ref="mainContentRef"
      class="relative z-10 min-h-screen w-full pt-28 pb-32 px-4 md:px-8"
    >
      <div class="max-w-[1400px] mx-auto">
        <!-- Search Section -->
        <div
          v-if="!weatherStore.hasData"
          class="flex flex-col items-center justify-center h-[70vh] text-center"
        >
          <h1
            class="font-display text-7xl md:text-9xl font-black tracking-tighter mb-8 animate-fade-in"
          >
            Weather<span class="text-outline">Vue</span>
          </h1>
          <CitySearch />
          <p
            class="mt-8 text-xs uppercase tracking-[0.4em] text-muted animate-pulse-slow"
          >
            Atmospheric Intelligence for the Modern Age
          </p>
        </div>

        <template v-else>
          <!-- Hero Section -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div class="lg:col-span-8">
              <CurrentWeather />
            </div>
            <div class="lg:col-span-4 flex flex-col justify-end">
              <TimelineScrubber />
            </div>
          </div>

          <!-- Bento Grid Layout -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-12"
          >
            <!-- Temperature Graph (Large) -->
            <div
              class="lg:col-span-8 bg-glass p-8 rounded-3xl border border-default shadow-glass"
            >
              <TemperatureGraph />
            </div>

            <!-- Wind (Medium) -->
            <div
              class="lg:col-span-4 bg-glass p-8 rounded-3xl border border-default shadow-glass flex items-center justify-center"
            >
              <WindCompass
                v-if="weather"
                :speed="weather.windSpeed"
                :direction="weatherStore.current?.windDirection || 0"
              />
            </div>

            <!-- Sunrise / Sunset (Medium) -->
            <div
              v-if="daily"
              class="lg:col-span-4 bg-glass p-8 rounded-3xl border border-default shadow-glass"
            >
              <SunriseSunsetArc
                :sunrise="daily.sunrise"
                :sunset="daily.sunset"
              />
            </div>

            <!-- UV Index (Small) -->
            <div
              class="lg:col-span-4 bg-glass p-8 rounded-3xl border border-default shadow-glass"
            >
              <UVIndexGauge v-if="weather" :value="weather.uvIndex" />
            </div>

            <!-- Precipitation (Small) -->
            <div
              class="lg:col-span-4 bg-glass p-8 rounded-3xl border border-default shadow-glass"
            >
              <PrecipitationBar
                v-if="weather"
                :probability="
                  'precipitationProbability' in weather
                    ? (weather.precipitationProbability ?? 0)
                    : 0
                "
                :amount="weather.precipitation"
              />
            </div>

            <!-- Secondary Metrics -->
            <div class="lg:col-span-3">
              <WeatherCard
                title="Humidity"
                :value="Math.round(weather?.humidity || 0)"
                unit="%"
                :icon="Droplets"
                description="The current relative humidity"
                accent="#3b82f6"
              />
            </div>
            <div class="lg:col-span-3">
              <WeatherCard
                title="Pressure"
                :value="Math.round(weatherStore.current?.pressure || 0)"
                unit="hPa"
                :icon="Gauge"
                description="Atmospheric pressure at sea level"
              />
            </div>
            <div class="lg:col-span-3">
              <WeatherCard
                title="Cloud Cover"
                :value="Math.round(weatherStore.current?.cloudCover || 0)"
                unit="%"
                :icon="Cloud"
                description="Percentage of the sky covered"
              />
            </div>
            <div class="lg:col-span-3">
              <WeatherCard
                title="Visibility"
                value="10"
                unit="km"
                :icon="Eye"
                description="Distance you can see clearly"
              />
            </div>
          </div>

          <!-- Forecast Section -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-4">
              <WeeklyForecast />
            </div>
            <div class="lg:col-span-8">
              <HourlyForecast />
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Settings Drawer -->
    <SettingsDrawer />

    <!-- Screen reader announcements -->
    <div
      id="announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    />
  </div>
</template>

<style scoped>
.bg-glass {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.border-default {
  border-color: var(--border-default);
}

.shadow-glass {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .shadow-glass {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
</style>
