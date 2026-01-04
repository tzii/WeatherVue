<script setup lang="ts">
interface Props {
  blur?: number
  opacity?: number
  border?: boolean
}

withDefaults(defineProps<Props>(), {
  blur: 20,
  opacity: 0.7,
  border: true
})
</script>

<template>
  <div 
    class="glassmorphic-card"
    :class="{ 'with-border': border }"
    :style="{
      '--blur': `${blur}px`,
      '--opacity': opacity
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.glassmorphic-card {
  background: rgba(var(--bg-card-rgb, 255, 255, 255), var(--opacity));
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.with-border {
  border: 1px solid var(--border-glass, rgba(255, 255, 255, 0.2));
}

[data-theme="dark"] .glassmorphic-card {
  background: rgba(0, 0, 0, var(--opacity));
}
</style>
