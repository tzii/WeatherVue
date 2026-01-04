<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { useSettingsStore, useLocationStore } from '@/stores'

const settingsStore = useSettingsStore()
const locationStore = useLocationStore()

const handleThemeClick = () => {
  settingsStore.cycleTheme()
}

const handleSettingsClick = () => {
  settingsStore.openDrawer()
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-20 pointer-events-none">
    <nav 
      class="flex justify-between items-center p-6 md:p-8"
      aria-label="Main navigation"
    >
      <!-- Logo / Brand -->
      <div class="flex items-center gap-2 pointer-events-auto">
        <!-- Theme toggle dot -->
        <button
          @click="handleThemeClick"
          class="theme-dot text-accent text-4xl leading-none hover:scale-125 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          :title="`Current theme: ${settingsStore.theme}. Click to cycle.`"
          aria-label="Toggle theme"
        >
          .
        </button>
        
        <!-- Brand name -->
        <span 
          class="font-display text-2xl font-bold tracking-tighter"
          style="color: var(--text-primary)"
        >
          WeatherVue
        </span>
      </div>
      
      <!-- Current city (center, optional) -->
      <div 
        v-if="locationStore.currentCity"
        class="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <span 
          class="text-xs font-bold uppercase tracking-[0.2em]"
          style="color: var(--text-muted)"
        >
          {{ locationStore.cityDisplayName }}
        </span>
      </div>
      
      <!-- Settings button -->
      <button
        @click="handleSettingsClick"
        class="settings-btn group flex items-center gap-4 pointer-events-auto focus:outline-none"
        aria-label="Open settings"
        :aria-expanded="settingsStore.isDrawerOpen"
        aria-controls="settings-drawer"
      >
        <span 
          class="hidden md:block text-xs font-bold uppercase tracking-[0.2em] transition-colors group-hover:text-accent"
          style="color: var(--text-muted)"
        >
          Configure
        </span>
        
        <div 
          class="w-12 h-12 border flex items-center justify-center transition-all group-hover:bg-accent group-hover:border-accent group-focus-visible:ring-2 group-focus-visible:ring-accent"
          style="border-color: var(--text-primary); color: var(--text-primary)"
        >
          <Menu 
            class="w-5 h-5 transition-colors group-hover:text-white" 
            aria-hidden="true"
          />
        </div>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.theme-dot {
  font-family: theme('fontFamily.display');
  line-height: 0.5;
  cursor: pointer;
}
</style>
