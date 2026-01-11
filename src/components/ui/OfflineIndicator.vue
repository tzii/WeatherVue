 <script setup lang="ts">
 import { ref, onMounted, onUnmounted } from 'vue'
 import { WifiOff, Wifi } from 'lucide-vue-next'
 
 const isOnline = ref(navigator.onLine)
 const showReconnected = ref(false)
 
 const handleOnline = () => {
   isOnline.value = true
   showReconnected.value = true
   setTimeout(() => {
     showReconnected.value = false
   }, 3000)
 }
 
 const handleOffline = () => {
   isOnline.value = false
   showReconnected.value = false
 }
 
 onMounted(() => {
   window.addEventListener('online', handleOnline)
   window.addEventListener('offline', handleOffline)
 })
 
 onUnmounted(() => {
   window.removeEventListener('online', handleOnline)
   window.removeEventListener('offline', handleOffline)
 })
 </script>
 
 <template>
   <Transition name="slide-up">
     <div 
       v-if="!isOnline || showReconnected"
       class="offline-indicator fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg"
       :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
       role="status"
       :aria-live="isOnline ? 'polite' : 'assertive'"
     >
       <Wifi v-if="isOnline" class="w-4 h-4 text-white" />
       <WifiOff v-else class="w-4 h-4 text-white" />
       <span class="text-white text-sm font-medium">
         {{ isOnline ? 'Back online' : 'You are offline' }}
       </span>
     </div>
   </Transition>
 </template>
 
 <style scoped>
 .slide-up-enter-active,
 .slide-up-leave-active {
   transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
 }
 
 .slide-up-enter-from,
 .slide-up-leave-to {
   opacity: 0;
   transform: translate(-50%, 100%);
 }
 </style>
