<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(true)
const isAnimating = ref(true)

onMounted(() => {
  // Hide splash after animation + delay
  setTimeout(() => {
    isAnimating.value = false
  }, 1500)
  
  setTimeout(() => {
    isVisible.value = false
  }, 2000)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="fade"
      @after-leave="$emit('hidden')"
    >
      <div 
        v-if="isVisible"
        class="splash-screen fixed inset-0 z-[100] flex items-center justify-center"
        :class="{ 'pointer-events-none': !isAnimating }"
        style="background-color: var(--bg-body)"
      >
        <div class="text-center">
          <!-- Logo -->
          <h1 
            class="logo font-display text-[12vw] md:text-[10vw] leading-none font-black text-outline"
            :class="{ 'animate': isAnimating }"
          >
            WV
          </h1>
          
          <!-- Accent line -->
          <div 
            class="accent-line h-1 bg-accent mx-auto mt-4"
            :class="{ 'animate': isAnimating }"
          />
          
          <!-- Loading text -->
          <p 
            class="loading-text text-xs uppercase tracking-[0.3em] mt-6 text-muted"
            :class="{ 'animate': isAnimating }"
          >
            Loading atmosphere...
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.text-outline {
  -webkit-text-stroke: 2px var(--text-secondary);
  color: transparent;
}

.text-muted {
  color: var(--text-muted);
}

/* Logo animation */
.logo {
  opacity: 0;
  transform: translateY(50px);
}

.logo.animate {
  animation: logoReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes logoReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accent line animation */
.accent-line {
  width: 0;
}

.accent-line.animate {
  animation: lineExpand 0.8s ease-out 0.5s forwards;
}

@keyframes lineExpand {
  to {
    width: 100px;
  }
}

/* Loading text animation */
.loading-text {
  opacity: 0;
}

.loading-text.animate {
  animation: fadeIn 0.5s ease-out 1s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
