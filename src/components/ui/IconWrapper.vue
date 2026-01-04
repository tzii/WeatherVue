<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  size?: string | number
  color?: string
  strokeWidth?: number
}>()
</script>

<template>
  <div 
    class="icon-wrapper flex items-center justify-center"
    :style="{ 
      width: typeof size === 'number' ? `${size}px` : size || '24px',
      height: typeof size === 'number' ? `${size}px` : size || '24px',
      color: color || 'currentColor'
    }"
  >
    <component 
      :is="icon" 
      :stroke-width="strokeWidth || 2"
      class="w-full h-full"
    />
  </div>
</template>
