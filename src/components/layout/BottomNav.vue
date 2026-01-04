<script setup lang="ts">
import { Home, Search, Settings } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores'

const settingsStore = useSettingsStore()
// const locationStore = useLocationStore() // Removed unused

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const focusSearch = () => {
  // Logic to focus search input if visible, or scroll to it
  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
  if (searchInput) {
    searchInput.focus()
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    // If search is hidden (e.g. showing weather), maybe reset to search view?
    // For now just scroll top where search likely resides in "empty" state
    scrollToTop()
  }
}
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 md:hidden z-30 border-t pb-safe"
    style="background: var(--bg-card); border-color: var(--border-default)"
  >
    <div class="flex justify-around items-center h-16">
      <button 
        @click="scrollToTop"
        class="flex flex-col items-center justify-center w-full h-full space-y-1"
        style="color: var(--text-secondary)"
      >
        <Home class="w-5 h-5" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </button>
      
      <button 
        @click="focusSearch"
        class="flex flex-col items-center justify-center w-full h-full space-y-1"
        style="color: var(--text-secondary)"
      >
        <Search class="w-5 h-5" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Search</span>
      </button>
      
      <button 
        @click="settingsStore.openDrawer()"
        class="flex flex-col items-center justify-center w-full h-full space-y-1"
        style="color: var(--text-secondary)"
      >
        <Settings class="w-5 h-5" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Settings</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
