<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-vue-next'
import { searchCities, debounce, reverseGeocode } from '@/services/geocodingApi'
import { useLocationStore } from '@/stores/locationStore'
import { useGeolocation } from '@/composables/useGeolocation'
import type { City } from '@/types'

const locationStore = useLocationStore()
const { updateLocation, coords, loading: geoLoading } = useGeolocation()

const query = ref('')
const results = ref<City[]>([])
const isSearching = ref(false)
const showResults = ref(false)

const performSearch = async (val: string) => {
  if (val.length < 2) {
    results.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  try {
    results.value = await searchCities(val)
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

const debouncedSearch = debounce(performSearch, 300)

watch(query, (newVal) => {
  showResults.value = true
  debouncedSearch(newVal)
})

const selectCity = (city: City) => {
  locationStore.setCurrentCity(city)
  query.value = ''
  showResults.value = false
}

const handleUseLocation = async () => {
  await updateLocation()
  if (coords.value) {
    const city = await reverseGeocode(coords.value.latitude, coords.value.longitude)
    if (city) {
      locationStore.setCurrentCity(city)
      query.value = ''
      showResults.value = false
    }
  }
}

const clearSearch = () => {
  query.value = ''
  results.value = []
}
</script>

<template>
  <div class="city-search relative w-full max-w-2xl mx-auto">
    <div class="relative group">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search class="w-5 h-5 transition-colors group-focus-within:text-accent" style="color: var(--text-muted)" />
      </div>
      
      <input
        v-model="query"
        type="text"
        placeholder="Search for a city..."
        class="w-full h-14 pl-12 pr-24 bg-transparent border-b-2 transition-all outline-none font-display text-xl"
        style="border-color: var(--border-default)"
        @focus="showResults = true"
      />
      
      <div class="absolute inset-y-0 right-4 flex items-center gap-2">
        <button 
          v-if="!query"
          @click="handleUseLocation"
          class="p-2 hover:text-accent transition-colors relative group/tooltip"
          :disabled="geoLoading"
          aria-label="Use my current location"
        >
          <Navigation v-if="!geoLoading" class="w-5 h-5" :class="{ 'animate-pulse': geoLoading }" style="color: var(--text-muted)" />
          <Loader2 v-else class="w-5 h-5 animate-spin" style="color: var(--accent)" />
          <span class="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
            Current Location
          </span>
        </button>
        <Loader2 v-if="isSearching" class="w-5 h-5 animate-spin" style="color: var(--accent)" />
        <button v-else-if="query" @click="clearSearch">
          <X class="w-5 h-5 hover:text-accent transition-colors" style="color: var(--text-muted)" />
        </button>
      </div>
    </div>

    <!-- Results Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="showResults && results.length > 0"
        class="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-xl border shadow-2xl"
        style="background: var(--bg-card); border-color: var(--border-default)"
      >
        <ul class="py-2">
          <li v-for="city in results" :key="city.id">
            <button
              class="w-full flex items-center px-4 py-3 hover:bg-accent/10 transition-colors text-left"
              @click="selectCity(city)"
            >
              <MapPin class="w-4 h-4 mr-3 opacity-50" />
              <div>
                <span class="font-bold">{{ city.name }}</span>
                <span class="ml-2 text-xs opacity-60">{{ city.admin1 }}, {{ city.country }}</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
input:focus {
  border-color: var(--accent);
}
</style>
