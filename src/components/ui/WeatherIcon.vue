<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2
})

// Get icon component by name
const iconComponent = computed(() => {
  const icons = LucideIcons as Record<string, any>
  return icons[props.name] || icons['Cloud']
})
</script>

<template>
  <component 
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    aria-hidden="true"
  />
</template>
