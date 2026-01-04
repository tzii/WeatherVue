<script setup lang="ts">
import { computed } from "vue";

interface Props {
  value: number;
}

const props = defineProps<Props>();

const uvLevel = computed(() => {
  if (props.value < 3) return { label: "Low", color: "#10b981" };
  if (props.value < 6) return { label: "Moderate", color: "#f59e0b" };
  if (props.value < 8) return { label: "High", color: "#ef4444" };
  if (props.value < 11) return { label: "Very High", color: "#dc2626" };
  return { label: "Extreme", color: "#7c3aed" };
});

// SVG Configuration
const radius = 40;
const strokeWidth = 12;
const circumference = Math.PI * radius; // Semi-circle circumference

const progressOffset = computed(() => {
  const p = Math.min(props.value / 12, 1);
  return circumference * (1 - p);
});

const needleRotation = computed(() => {
  const p = Math.min(props.value / 12, 1);
  return -90 + p * 180;
});
</script>

<template>
  <div class="uv-gauge flex flex-col items-center">
    <h3
      class="text-xs font-bold uppercase tracking-widest mb-6"
      style="color: var(--text-muted)"
    >
      UV Index
    </h3>

    <div class="relative w-32 h-20 overflow-hidden">
      <!-- SVG Gauge -->
      <svg viewBox="0 0 100 55" class="w-full h-full overflow-visible">
        <!-- Background Track -->
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="var(--border-default)"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />

        <!-- Colored Progress -->
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          :stroke="uvLevel.color"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          class="transition-all duration-1000 ease-out opacity-80"
        />
      </svg>

      <!-- Needle -->
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-14 origin-bottom transition-transform duration-1000 ease-out"
        :style="{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }"
      >
        <div
          class="w-full h-full bg-primary rounded-full shadow-lg"
          :style="{ backgroundColor: uvLevel.color }"
        />
      </div>
    </div>

    <div class="text-center mt-2">
      <span class="text-2xl font-bold font-display">{{
        Math.round(value)
      }}</span>
      <p
        class="text-[10px] uppercase font-bold tracking-widest"
        :style="{ color: uvLevel.color }"
      >
        {{ uvLevel.label }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* No specific styles needed as we use Tailwind classes */
</style>
