<script setup lang="ts">
import { useLocationStore } from '@/stores/locationStore'
import { Clock, X } from 'lucide-vue-next'
import type { City } from '@/types'

const locationStore = useLocationStore()

const handleSelect = (city: City) => {
  locationStore.setCurrentCity(city)
}

const handleRemove = (e: Event, cityId: string) => {
  e.stopPropagation()
  locationStore.removeFromRecentCities(cityId)
}
</script>

<template>
  <div v-if="locationStore.recentCities.length > 0" class="w-full mt-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xs font-bold uppercase tracking-widest" style="color: var(--text-muted)">
        Recent Locations
      </h3>
      <button 
        @click="locationStore.clearRecentCities()"
        class="text-xs hover:underline"
        style="color: var(--accent)"
      >
        Clear All
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <button
        v-for="city in locationStore.recentCities"
        :key="city.id"
        @click="handleSelect(city)"
        class="group relative flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-accent"
        style="background: var(--bg-card); border-color: var(--border-default)"
      >
        <Clock class="w-4 h-4" style="color: var(--text-muted)" />
        
        <div class="flex-1 text-left overflow-hidden">
          <p class="font-bold truncate" style="color: var(--text-primary)">
            {{ city.name }}
          </p>
          <p class="text-xs truncate" style="color: var(--text-muted)">
            {{ city.country }}
          </p>
        </div>
        
        <div 
          role="button"
          tabindex="0"
          @click="(e) => handleRemove(e, city.id)"
          class="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <X class="w-3 h-3" />
        </div>
      </button>
    </div>
  </div>
</template>
