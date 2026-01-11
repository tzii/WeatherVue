 import { onMounted, onUnmounted } from 'vue'
 import { useSettingsStore, useWeatherStore } from '@/stores'
 
 export const useKeyboardShortcuts = () => {
   const settingsStore = useSettingsStore()
   const weatherStore = useWeatherStore()
   
   const handleKeyDown = (e: KeyboardEvent) => {
     // Skip if user is typing in an input
     if (
       e.target instanceof HTMLInputElement ||
       e.target instanceof HTMLTextAreaElement
     ) {
       return
     }
     
     // Keyboard shortcuts
     switch (e.key) {
       case 't':
       case 'T':
         // Toggle theme
         if (!e.ctrlKey && !e.metaKey) {
           settingsStore.cycleTheme()
         }
         break
         
       case ',':
         // Open settings
         if (!e.ctrlKey && !e.metaKey) {
           settingsStore.openDrawer()
         }
         break
         
       case 'Escape':
         // Close settings drawer
         if (settingsStore.isDrawerOpen) {
           settingsStore.closeDrawer()
         }
         break
         
       case 'r':
       case 'R':
         // Refresh weather (when not in input)
         if (!e.ctrlKey && !e.metaKey && weatherStore.hasData) {
           weatherStore.setLoading(true)
         }
         break
         
       case '/':
       case '?':
         // Focus search (could be implemented)
         if (!e.ctrlKey && !e.metaKey) {
           const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement
           searchInput?.focus()
         }
         break
     }
   }
   
   onMounted(() => {
     document.addEventListener('keydown', handleKeyDown)
   })
   
   onUnmounted(() => {
     document.removeEventListener('keydown', handleKeyDown)
   })
 }
