<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  borderRadius?: string
}>()
</script>

<template>
  <div 
    class="skeleton-loader animate-pulse bg-gray-200 dark:bg-gray-700"
    :style="{ 
      width: width || '100%', 
      height: height || '20px', 
      borderRadius: borderRadius || '4px' 
    }"
  ></div>
</template>

<style scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-card-hover) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
