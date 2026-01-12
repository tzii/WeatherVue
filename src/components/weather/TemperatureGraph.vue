<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import * as d3 from 'd3'
import debounce from 'lodash/debounce'
import { useWeatherStore, useSettingsStore } from '@/stores'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const margin = { top: 20, right: 20, bottom: 30, left: 40 }
const height = 200

// Filter data based on selected day
const graphData = computed(() => {
  const index = weatherStore.selectedDayIndex
  // Only show graph for today (0) and tomorrow (1) as we have 48h data
  if (index > 1) return []

  const selectedDate = weatherStore.daily[index]?.date
  if (!selectedDate) return []

  return weatherStore.hourly.filter(h => h.time.startsWith(selectedDate))
})

const drawGraph = () => {
  if (!svgRef.value || !containerRef.value || graphData.value.length === 0) return

  const width = containerRef.value.clientWidth - margin.left - margin.right
  const data = graphData.value

  // Clear previous content
  d3.select(svgRef.value).selectAll('*').remove()

  const svg = d3
    .select(svgRef.value)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X scale
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, d => new Date(d.time)) as [Date, Date])
    .range([0, width])

  // Y scale
  const y = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.temperature)! - 2, d3.max(data, d => d.temperature)! + 2])
    .range([height, 0])

  // Area generator
  const area = d3
    .area<any>()
    .x(d => x(new Date(d.time)))
    .y0(height)
    .y1(d => y(d.temperature))
    .curve(d3.curveMonotoneX)

  // Line generator
  const line = d3
    .line<any>()
    .x(d => x(new Date(d.time)))
    .y(d => y(d.temperature))
    .curve(d3.curveMonotoneX)

  // Gradient
  const gradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'temp-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'var(--accent)')
    .attr('stop-opacity', 0.4)

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'var(--accent)')
    .attr('stop-opacity', 0)

  // Add area
  svg.append('path').datum(data).attr('fill', 'url(#temp-gradient)').attr('d', area)

  // Add line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 3)
    .attr('d', line)

  // Add X axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(6)
        .tickFormat(d3.timeFormat('%H:%M') as any)
    )
    .attr('color', 'var(--text-muted)')
    .select('.domain')
    .remove()

  // Add Y axis
  svg
    .append('g')
    .call(d3.axisLeft(y).ticks(5))
    .attr('color', 'var(--text-muted)')
    .select('.domain')
    .remove()

  // Add interactive vertical line
  const focus = svg.append('g').style('display', 'none')

  focus
    .append('line')
    .attr('class', 'focus-line')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'var(--text-secondary)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  // Update focus line based on timeline position (only if viewing today)
  if (weatherStore.selectedDayIndex === 0) {
    watch(
      () => weatherStore.timelinePosition,
      pos => {
        // Need to map global timeline pos to this day's graph
        // But timelinePosition is 0-1 across 48h.
        // This is tricky.
        // If graph is 24h, we need to adapt.
        // Simplification: Only show scrubber line on "Today" graph

        const totalHours = data.length - 1
        // timelinePosition is 0-1 for 48h.
        // Today is 0-0.5 of timeline.

        const relativePos = pos * 2 // Scale up
        if (relativePos <= 1) {
          const index = Math.round(relativePos * totalHours)
          const d = data[index]
          if (d) {
            const px = x(new Date(d.time))
            focus.style('display', null)
            focus.select('.focus-line').attr('x1', px).attr('x2', px)
          }
        } else {
          focus.style('display', 'none')
        }
      },
      { immediate: true }
    )
  }
}

const handleResize = debounce(() => {
  drawGraph()
}, 250)

onMounted(() => {
  drawGraph()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(graphData, drawGraph)
watch(() => settingsStore.temperatureUnit, drawGraph)
</script>

<template>
  <div ref="containerRef" class="temperature-graph w-full overflow-hidden">
    <h3 class="text-xs font-bold uppercase tracking-[0.2em] mb-4" style="color: var(--accent)">
      {{ weatherStore.selectedDayIndex === 0 ? 'Temperature Trend' : '24-Hour Forecast' }}
    </h3>
    <div
      v-if="graphData.length === 0"
      class="flex items-center justify-center h-[200px] text-muted text-sm"
    >
      Graph data not available for this date
    </div>
    <svg v-else ref="svgRef"></svg>
  </div>
</template>

<style scoped>
.temperature-graph {
  min-height: 250px;
}

:deep(.tick text) {
  font-family: var(--font-mono);
  font-size: 10px;
}
</style>
