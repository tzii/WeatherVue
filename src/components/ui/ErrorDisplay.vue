 <script setup lang="ts">
 import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-vue-next'
 
 defineProps<{
   error: Error | null
   isOffline?: boolean
   retrying?: boolean
 }>()
 
 const emit = defineEmits<{
   retry: []
 }>()
 </script>
 
 <template>
   <div 
     class="error-display flex flex-col items-center justify-center p-8 rounded-3xl border border-red-500/30 bg-red-500/10"
     role="alert"
     aria-live="assertive"
   >
     <div class="icon-wrapper mb-4">
       <WifiOff v-if="isOffline" class="w-12 h-12 text-red-500" />
       <AlertTriangle v-else class="w-12 h-12 text-red-500" />
     </div>
     
     <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary)">
       {{ isOffline ? 'You are offline' : 'Something went wrong' }}
     </h3>
     
     <p class="text-sm text-center mb-6" style="color: var(--text-muted)">
       {{ isOffline 
         ? 'Check your internet connection and try again.' 
         : error?.message || 'Failed to load weather data. Please try again.' 
       }}
     </p>
     
     <button
       @click="emit('retry')"
       :disabled="retrying"
       class="retry-btn flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
       :class="{ 'animate-pulse': retrying }"
     >
       <RefreshCw 
         class="w-4 h-4" 
         :class="{ 'animate-spin': retrying }"
       />
       {{ retrying ? 'Retrying...' : 'Try Again' }}
     </button>
   </div>
 </template>
 
 <style scoped>
 .retry-btn {
   background-color: var(--accent);
   color: white;
 }
 
 .retry-btn:hover:not(:disabled) {
   box-shadow: 0 4px 20px var(--accent);
 }
 </style>
