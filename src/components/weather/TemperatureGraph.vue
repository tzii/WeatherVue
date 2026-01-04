<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { useWeatherStore, useSettingsStore } from '@/stores'

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const margin = { top: 20, right: 20, bottom: 30, left: 40 }
const height = 200

const drawGraph = () => {
  if (!svgRef.value || !containerRef.value || weatherStore.hourly.length === 0) return

  const width = containerRef.value.clientWidth - margin.left - margin.right
  const data = weatherStore.hourly.slice(0, 48)

  // Clear previous content
  d3.select(svgRef.value).selectAll('*').remove()

  const svg = d3.select(svgRef.value)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X scale
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.time)) as [Date, Date])
    .range([0, width])

  // Y scale
  const y = d3.scaleLinear()
    .domain([
      d3.min(data, d => d.temperature)! - 2,
      d3.max(data, d => d.temperature)! + 2
    ])
    .range([height, 0])

  // Area generator
  const area = d3.area<any>()
    .x(d => x(new Date(d.time)))
    .y0(height)
    .y1(d => y(d.temperature))
    .curve(d3.curveMonotoneX)

  // Line generator
  const line = d3.line<any>()
    .x(d => x(new Date(d.time)))
    .y(d => y(d.temperature))
    .curve(d3.curveMonotoneX)

  // Gradient
  const gradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'temp-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%')

  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'var(--accent)')
    .attr('stop-opacity', 0.4)

  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'var(--accent)')
    .attr('stop-opacity', 0)

  // Add area
  svg.append('path')
    .datum(data)
    .attr('fill', 'url(#temp-gradient)')
    .attr('d', area)

  // Add line
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent)')
    .attr('stroke-width', 3)
    .attr('d', line)

  // Add X axis (simplified)
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%H:%M') as any))
    .attr('color', 'var(--text-muted)')
    .select('.domain').remove()

  // Add interactive vertical line
  const focus = svg.append('g')
    .style('display', 'none')

  focus.append('line')
    .attr('class', 'focus-line')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'var(--text-secondary)')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')

  // Update focus line based on timeline position
  watch(() => weatherStore.timelinePosition, (pos) => {
    const totalHours = data.length - 1
    const index = Math.round(pos * totalHours)
    const d = data[index]
    if (d) {
      const px = x(new Date(d.time))
      focus.style('display', null)
      focus.select('.focus-line')
        .attr('x1', px)
        .attr('x2', px)
    }
  }, { immediate: true })
}

onMounted(() => {
  drawGraph()
  window.addEventListener('resize', drawGraph)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawGraph)
})

watch(() => weatherStore.hourly, drawGraph)
watch(() => settingsStore.temperatureUnit, drawGraph)
</script>

<template>
  <div ref="containerRef" class="temperature-graph w-full overflow-hidden">
    <h3 class="text-xs font-bold uppercase tracking-widest mb-4" style="color: var(--text-muted)">
      48-Hour Temperature
    </h3>
    <svg ref="svgRef"></svg>
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
