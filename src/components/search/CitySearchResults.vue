<script setup lang="ts">
import { useLocationStore } from '@/stores/locationStore'
import { MapPin, ArrowRight } from 'lucide-vue-next'
import type { City } from '@/types'

const locationStore = useLocationStore()

const handleSelect = (city: City) => {
  locationStore.setCurrentCity(city)
  locationStore.clearSearch()
}
</script>

<template>
  <div v-if="locationStore.searchResults.length > 0" class="w-full">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted)">
      Search Results
    </h3>
    
    <div class="space-y-2">
      <button
        v-for="city in locationStore.searchResults"
        :key="city.id"
        @click="handleSelect(city)"
        class="group w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
        style="background: var(--bg-card); border-color: var(--border-default)"
      >
        <div class="flex items-center gap-4">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white"
            style="background: var(--bg-card-hover); color: var(--text-secondary)"
          >
            <MapPin class="w-5 h-5" />
          </div>
          
          <div class="text-left">
            <p class="font-display font-bold text-lg" style="color: var(--text-primary)">
              {{ city.name }}
            </p>
            <p class="text-xs uppercase tracking-wider" style="color: var(--text-muted)">
              {{ city.country }}
              <span v-if="city.admin1">· {{ city.admin1 }}</span>
            </p>
          </div>
        </div>
        
        <ArrowRight 
          class="w-5 h-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
          style="color: var(--accent)"
        />
      </button>
    </div>
  </div>
  
  <div v-else-if="locationStore.isSearching" class="text-center py-8">
    <div class="inline-block animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2" style="color: var(--accent)" />
    <p class="text-sm" style="color: var(--text-muted)">Searching...</p>
  </div>
  
  <div v-else-if="locationStore.searchQuery && !locationStore.isSearching && locationStore.searchResults.length === 0" class="text-center py-8">
    <p class="text-sm" style="color: var(--text-muted)">No cities found</p>
  </div>
</template>
