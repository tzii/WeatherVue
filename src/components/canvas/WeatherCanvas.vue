<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useWeatherStore, useSettingsStore } from '@/stores'
import type { WeatherType } from '@/types'

// Three.js will be dynamically imported to enable code splitting
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isLoaded = ref(false)

const weatherStore = useWeatherStore()
const settingsStore = useSettingsStore()

let animationId: number | null = null
let scene: any = null
let camera: any = null
let renderer: any = null
let particles: any = null
let THREE: any = null

const weatherType = computed<WeatherType>(() => weatherStore.weatherType)

// Particle configurations for different weather types
const particleConfigs: Record<WeatherType, { count: number; speed: number; color: string; size: number }> = {
  clear: { count: 50, speed: 0.5, color: '#ffd700', size: 0.02 },
  cloudy: { count: 100, speed: 0.3, color: '#9ca3af', size: 0.03 },
  rain: { count: 500, speed: 3, color: '#60a5fa', size: 0.01 },
  storm: { count: 800, speed: 5, color: '#4b5563', size: 0.01 },
  snow: { count: 300, speed: 0.5, color: '#ffffff', size: 0.02 },
  fog: { count: 200, speed: 0.1, color: '#d1d5db', size: 0.05 }
}

const initThree = async () => {
  if (!canvasRef.value) return
  
  // Dynamic import of Three.js
  THREE = await import('three')
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Scene
  scene = new THREE.Scene()
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5
  
  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  // Create initial particles
  createParticles(weatherType.value)
  
  isLoaded.value = true
  animate()
}

const createParticles = (type: WeatherType) => {
  if (!THREE || !scene) return
  
  // Remove existing particles
  if (particles) {
    scene.remove(particles)
    particles.geometry.dispose()
    particles.material.dispose()
  }
  
  const config = particleConfigs[type]
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(config.count * 3)
  const velocities = new Float32Array(config.count)
  
  for (let i = 0; i < config.count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    velocities[i] = 0.5 + Math.random() * 0.5
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.userData.velocities = velocities
  geometry.userData.config = config
  
  const material = new THREE.PointsMaterial({
    color: new THREE.Color(config.color),
    size: config.size,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const animate = () => {
  if (!renderer || !scene || !camera || !particles) return
  
  animationId = requestAnimationFrame(animate)
  
  const positions = particles.geometry.attributes.position.array
  const velocities = particles.geometry.userData.velocities
  const config = particles.geometry.userData.config
  
  // Update particle positions based on weather type
  for (let i = 0; i < positions.length / 3; i++) {
    const weatherT = weatherType.value
    
    if (weatherT === 'rain' || weatherT === 'storm') {
      // Rain falls down
      positions[i * 3 + 1] -= velocities[i] * config.speed * 0.05
      
      // Reset when below view
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10
        positions[i * 3] = (Math.random() - 0.5) * 20
      }
    } else if (weatherT === 'snow') {
      // Snow drifts gently
      positions[i * 3 + 1] -= velocities[i] * config.speed * 0.02
      positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01
      
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 10
        positions[i * 3] = (Math.random() - 0.5) * 20
      }
    } else {
      // Gentle floating for other types
      positions[i * 3] += Math.sin(Date.now() * 0.0005 + i * 0.1) * 0.002
      positions[i * 3 + 1] += Math.cos(Date.now() * 0.0003 + i * 0.1) * 0.002
    }
  }
  
  particles.geometry.attributes.position.needsUpdate = true
  
  // Slow rotation
  particles.rotation.y += 0.0002
  
  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!camera || !renderer) return
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// Watch for weather type changes
watch(weatherType, (newType) => {
  if (isLoaded.value) {
    createParticles(newType)
  }
})

onMounted(() => {
  if (!settingsStore.prefersReducedMotion) {
    initThree()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="weather-canvas-container">
    <!-- Gradient background -->
    <div 
      class="gradient-bg absolute inset-0 transition-colors duration-1000"
      :style="{
        background: `linear-gradient(180deg, var(--sky-start), var(--sky-end))`
      }"
    />
    
    <!-- Three.js canvas -->
    <canvas 
      ref="canvasRef"
      class="absolute inset-0"
      :class="{ 'opacity-0': !isLoaded }"
    />
    
    <!-- Noise texture overlay -->
    <div class="noise-overlay absolute inset-0 pointer-events-none" />
  </div>
</template>

<style scoped>
.weather-canvas-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-bg {
  z-index: 0;
}

canvas {
  z-index: 1;
  transition: opacity 0.5s ease;
}

.noise-overlay {
  z-index: 2;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
</style>
