<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { X, Sun, Moon, Monitor, Terminal, Volume2, VolumeX, Vibrate } from 'lucide-vue-next'
import { useSettingsStore, useLocationStore } from '@/stores'
import { DEFAULT_CITIES } from '@/types'
import type { Theme, TemperatureUnit, SpeedUnit, City } from '@/types'

const settingsStore = useSettingsStore()
const locationStore = useLocationStore()

const drawerRef = ref<HTMLElement | null>(null)

// Theme options
const themes: { value: Theme; label: string; icon: any }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'terminal', label: 'Terminal', icon: Terminal }
]

// Unit options
const tempUnits: { value: TemperatureUnit; label: string }[] = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' }
]

const speedUnits: { value: SpeedUnit; label: string }[] = [
  { value: 'kmh', label: 'km/h' },
  { value: 'mph', label: 'mph' },
  { value: 'ms', label: 'm/s' }
]

// City selection
const selectCity = (city: City) => {
  locationStore.setCurrentCity(city)
  settingsStore.closeDrawer()
}

// Close drawer handlers
const handleClose = () => {
  settingsStore.closeDrawer()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && settingsStore.isDrawerOpen) {
    handleClose()
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (drawerRef.value && !drawerRef.value.contains(e.target as Node)) {
    handleClose()
  }
}

// Focus trap
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Handle overlay click
watch(() => settingsStore.isDrawerOpen, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div 
      v-if="settingsStore.isDrawerOpen"
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
      aria-hidden="true"
    />
  </Transition>
  
  <!-- Drawer -->
  <Transition name="slide">
    <aside
      v-if="settingsStore.isDrawerOpen"
      ref="drawerRef"
      id="settings-drawer"
      class="fixed inset-y-0 right-0 w-full md:w-[450px] z-40 flex flex-col shadow-2xl overflow-hidden"
      style="background-color: var(--bg-drawer)"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <!-- Header -->
      <div 
        class="p-8 flex justify-between items-end border-b"
        style="border-color: var(--border-default)"
      >
        <h2 
          id="drawer-title"
          class="font-display text-4xl font-bold italic"
          style="color: var(--text-primary)"
        >
          Settings
        </h2>
        
        <button
          @click="handleClose"
          class="text-sm uppercase tracking-widest hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style="color: var(--text-muted)"
          aria-label="Close settings"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8 space-y-10">
        <!-- Theme Section -->
        <section>
          <h3 class="section-label">00 / Appearance</h3>
          <div class="flex gap-2 mt-4">
            <button
              v-for="t in themes"
              :key="t.value"
              @click="settingsStore.setTheme(t.value)"
              class="theme-btn flex-1 flex items-center justify-center gap-2 py-3 px-4 border text-xs font-bold uppercase tracking-wider transition-all"
              :class="{
                'active': settingsStore.theme === t.value
              }"
              :aria-pressed="settingsStore.theme === t.value"
            >
              <component :is="t.icon" class="w-4 h-4" />
              <span class="hidden sm:inline">{{ t.label }}</span>
            </button>
          </div>
        </section>
        
        <!-- Location Section -->
        <section>
          <h3 class="section-label">01 / Location</h3>
          <div class="mt-4 space-y-2">
            <button
              v-for="city in DEFAULT_CITIES"
              :key="city.id"
              @click="selectCity(city)"
              class="city-btn w-full text-left py-3 px-4 border transition-all"
              :class="{
                'active': locationStore.currentCity?.id === city.id
              }"
            >
              <span class="font-display text-xl font-bold">{{ city.name }}</span>
              <span class="text-xs uppercase tracking-wider ml-2" style="color: var(--text-muted)">
                {{ city.country }}
              </span>
            </button>
          </div>
        </section>
        
        <!-- Units Section -->
        <section>
          <h3 class="section-label">02 / Units</h3>
          
          <!-- Temperature -->
          <div class="mt-4">
            <label class="text-xs uppercase tracking-wider mb-2 block" style="color: var(--text-muted)">
              Temperature
            </label>
            <div class="flex gap-2">
              <button
                v-for="unit in tempUnits"
                :key="unit.value"
                @click="settingsStore.setTemperatureUnit(unit.value)"
                class="unit-btn flex-1 py-2 border text-sm font-bold transition-all"
                :class="{ 'active': settingsStore.temperatureUnit === unit.value }"
              >
                {{ unit.label }}
              </button>
            </div>
          </div>
          
          <!-- Wind Speed -->
          <div class="mt-4">
            <label class="text-xs uppercase tracking-wider mb-2 block" style="color: var(--text-muted)">
              Wind Speed
            </label>
            <div class="flex gap-2">
              <button
                v-for="unit in speedUnits"
                :key="unit.value"
                @click="settingsStore.setSpeedUnit(unit.value)"
                class="unit-btn flex-1 py-2 border text-sm font-bold transition-all"
                :class="{ 'active': settingsStore.speedUnit === unit.value }"
              >
                {{ unit.label }}
              </button>
            </div>
          </div>
        </section>
        
        <!-- Accessibility Section -->
        <section>
          <h3 class="section-label">03 / Accessibility</h3>
          
          <div class="mt-4 space-y-3">
            <!-- Reduced Motion -->
            <label class="toggle-row">
              <span class="toggle-label">Reduce motion</span>
              <button
                @click="settingsStore.toggleReducedMotion()"
                class="toggle-switch"
                :class="{ 'active': settingsStore.reducedMotion }"
                :aria-pressed="settingsStore.reducedMotion"
                role="switch"
              >
                <span class="toggle-thumb" />
              </button>
            </label>
            
            <!-- High Contrast -->
            <label class="toggle-row">
              <span class="toggle-label">High contrast</span>
              <button
                @click="settingsStore.toggleHighContrast()"
                class="toggle-switch"
                :class="{ 'active': settingsStore.highContrast }"
                :aria-pressed="settingsStore.highContrast"
                role="switch"
              >
                <span class="toggle-thumb" />
              </button>
            </label>
          </div>
        </section>
        
        <!-- Audio Section -->
        <section>
          <h3 class="section-label">04 / Audio</h3>
          
          <div class="mt-4 space-y-3">
            <!-- Ambient Audio -->
            <label class="toggle-row">
              <span class="toggle-label flex items-center gap-2">
                <component :is="settingsStore.ambientAudioEnabled ? Volume2 : VolumeX" class="w-4 h-4" />
                Ambient sounds
              </span>
              <button
                @click="settingsStore.toggleAmbientAudio()"
                class="toggle-switch"
                :class="{ 'active': settingsStore.ambientAudioEnabled }"
                :aria-pressed="settingsStore.ambientAudioEnabled"
                role="switch"
              >
                <span class="toggle-thumb" />
              </button>
            </label>
            
            <!-- Volume slider -->
            <div v-if="settingsStore.ambientAudioEnabled" class="pl-6">
              <input
                type="range"
                min="0"
                max="100"
                :value="settingsStore.ambientVolume"
                @input="settingsStore.setAmbientVolume(Number(($event.target as HTMLInputElement).value))"
                class="volume-slider w-full"
                aria-label="Volume"
              />
            </div>
            
            <!-- Haptics -->
            <label class="toggle-row">
              <span class="toggle-label flex items-center gap-2">
                <Vibrate class="w-4 h-4" />
                Haptic feedback
              </span>
              <button
                @click="settingsStore.toggleHaptics()"
                class="toggle-switch"
                :class="{ 'active': settingsStore.hapticsEnabled }"
                :aria-pressed="settingsStore.hapticsEnabled"
                role="switch"
              >
                <span class="toggle-thumb" />
              </button>
            </label>
          </div>
        </section>
      </div>
      
      <!-- Footer -->
      <div 
        class="p-6 border-t text-center"
        style="border-color: var(--border-default)"
      >
        <p class="text-xs" style="color: var(--text-muted)">
          WeatherVue 2.0 &middot; Built with Vue 3
        </p>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.section-label {
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.theme-btn {
  border-color: var(--border-default);
  color: var(--text-muted);
}

.theme-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.theme-btn.active {
  background-color: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg-body);
}

.city-btn {
  border-color: var(--border-default);
  color: var(--text-primary);
}

.city-btn:hover {
  border-color: var(--accent);
}

.city-btn.active {
  border-color: var(--accent);
  background-color: var(--accent);
  color: white;
}

.unit-btn {
  border-color: var(--border-default);
  color: var(--text-muted);
}

.unit-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.unit-btn.active {
  background-color: var(--accent);
  border-color: var(--accent);
  color: white;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.toggle-label {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: var(--border-default);
  transition: background-color 0.2s;
}

.toggle-switch.active {
  background-color: var(--accent);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(24px);
}

.volume-slider {
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--border-default);
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
