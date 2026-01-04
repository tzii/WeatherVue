# WeatherVue 2.0 - Animation & Motion Design

> Comprehensive motion design specifications for an award-winning experience

## Table of Contents

1. [Motion Philosophy](#motion-philosophy)
2. [Timing & Easing](#timing--easing)
3. [Entrance Animations](#entrance-animations)
4. [Micro-interactions](#micro-interactions)
5. [Data Animations](#data-animations)
6. [Weather Effects](#weather-effects)
7. [Page Transitions](#page-transitions)
8. [Performance Guidelines](#performance-guidelines)

---

## Motion Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Every animation serves a function (feedback, continuity, or delight) |
| **Natural** | Motion follows physics—ease in/out, momentum, spring dynamics |
| **Responsive** | Animations react to user input instantly |
| **Accessible** | All motion respects reduced-motion preferences |
| **Performant** | 60fps target, GPU-accelerated properties only |

### Motion Hierarchy

```
1. FEEDBACK (fastest)     - Button press, toggle, hover
   └─ 100-200ms
   
2. TRANSITION (medium)    - State changes, reveals
   └─ 200-400ms
   
3. ORCHESTRATION (slower) - Page transitions, complex sequences
   └─ 400-800ms
   
4. AMBIENT (continuous)   - Weather effects, floating particles
   └─ Infinite, subtle
```

---

## Timing & Easing

### Duration Scale

```typescript
const durations = {
  instant: 0,           // Reduced motion fallback
  fastest: 100,         // Micro-feedback
  fast: 200,            // Hovers, toggles
  normal: 300,          // Standard transitions
  slow: 500,            // Reveals, slides
  slower: 700,          // Complex animations
  slowest: 1000,        // Hero animations
  
  // Stagger delays
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150
  }
}
```

### Easing Functions

```typescript
const easings = {
  // Standard easings
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 0.2)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Expressive easings
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  
  // Spring physics (GSAP)
  spring: 'elastic.out(1, 0.5)',
  springTight: 'elastic.out(1, 0.75)',
  springLoose: 'elastic.out(1, 0.3)',
  
  // Bounce
  bounce: 'bounce.out',
  
  // Weather-specific
  wind: 'sine.inOut',          // Oscillating motion
  rain: 'power1.in',           // Accelerating fall
  float: 'sine.inOut',         // Gentle floating
}
```

### CSS Custom Properties

```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  
  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 0.2);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}
```

---

## Entrance Animations

### Splash Screen

```typescript
// Splash screen sequence
const splashTimeline = gsap.timeline()

// 1. Logo letters reveal
splashTimeline.fromTo('.logo-letter', 
  { y: 50, opacity: 0 },
  { 
    y: 0, 
    opacity: 1, 
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  }
)

// 2. Accent line expands
.fromTo('.accent-line',
  { scaleX: 0 },
  { 
    scaleX: 1, 
    duration: 0.6,
    ease: 'power2.out'
  },
  '-=0.3'
)

// 3. Fade out splash
.to('.splash-screen',
  {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => splashScreen.style.display = 'none'
  },
  '+=0.3'
)
```

```css
/* CSS fallback for splash */
@keyframes logo-reveal {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-letter {
  animation: logo-reveal 0.8s var(--ease-out-expo) forwards;
  animation-delay: calc(var(--index) * 0.1s);
}
```

### Page Load / Weather Cards

```typescript
// Staggered card entrance
const animateCards = (cards: HTMLElement[]) => {
  gsap.fromTo(cards,
    {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    }
  )
}
```

### Drawer Slide

```typescript
// Settings drawer animation
const openDrawer = () => {
  gsap.to('.settings-drawer', {
    x: 0,
    duration: 0.5,
    ease: 'power3.out'
  })
  
  // Stagger content items
  gsap.fromTo('.drawer-item',
    { opacity: 0, x: 20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.05,
      delay: 0.2,
      ease: 'power2.out'
    }
  )
}

const closeDrawer = () => {
  gsap.to('.settings-drawer', {
    x: '100%',
    duration: 0.4,
    ease: 'power3.inOut'
  })
}
```

### Scroll Reveals

```typescript
// Intersection Observer + GSAP
const useScrollReveal = () => {
  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out'
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.set(el, { opacity: 0, y: 30 })
      observer.observe(el)
    })
  })
}
```

---

## Micro-interactions

### Button Hover

```css
.btn {
  transition: 
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  transition-duration: 50ms;
}
```

### Magnetic Button Effect

```typescript
const useMagneticEffect = (
  element: Ref<HTMLElement>,
  options = { strength: 0.3, radius: 100 }
) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    
    if (distance < options.radius) {
      const strength = 1 - (distance / options.radius)
      
      gsap.to(element.value, {
        x: deltaX * strength * options.strength,
        y: deltaY * strength * options.strength,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }
  
  const handleMouseLeave = () => {
    gsap.to(element.value, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    })
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
    element.value.addEventListener('mouseleave', handleMouseLeave)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    element.value.removeEventListener('mouseleave', handleMouseLeave)
  })
}
```

### Card Parallax

```typescript
const useCardParallax = (cardRef: Ref<HTMLElement>) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = cardRef.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    
    gsap.to(cardRef.value, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out'
    })
    
    // Move layers at different speeds
    gsap.to(cardRef.value.querySelector('.card-bg'), {
      x: x * 10,
      y: y * 10,
      duration: 0.5
    })
    
    gsap.to(cardRef.value.querySelector('.card-content'), {
      x: x * 20,
      y: y * 20,
      duration: 0.5
    })
    
    gsap.to(cardRef.value.querySelector('.card-icon'), {
      x: x * 30,
      y: y * 30,
      duration: 0.5
    })
  }
  
  const handleMouseLeave = () => {
    gsap.to(cardRef.value, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
    
    gsap.to([
      cardRef.value.querySelector('.card-bg'),
      cardRef.value.querySelector('.card-content'),
      cardRef.value.querySelector('.card-icon')
    ], {
      x: 0,
      y: 0,
      duration: 0.5
    })
  }
  
  // ... event listener setup
}
```

### Toggle Switch

```css
.toggle-track {
  transition: background-color var(--duration-fast) var(--ease-default);
}

.toggle-thumb {
  transition: transform var(--duration-normal) var(--ease-out-back);
}

.toggle-input:checked + .toggle-track {
  background-color: var(--accent);
}

.toggle-input:checked + .toggle-track .toggle-thumb {
  transform: translateX(24px);
}
```

### Checkbox Ticket

```css
.checkbox-ticket {
  transition: 
    transform var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.checkbox-ticket:hover {
  transform: translateY(-1px);
}

.checkbox-ticket.active {
  transform: translateY(-2px);
  background-color: var(--accent);
}

.checkbox-ticket:active {
  transform: translateY(0) scale(0.98);
}
```

---

## Data Animations

### Animated Numbers

```typescript
// Counting animation with easing
const useAnimatedNumber = (
  targetValue: Ref<number>,
  options = { duration: 1000, decimals: 0 }
) => {
  const displayValue = ref(0)
  const previousValue = ref(0)
  
  watch(targetValue, (newVal) => {
    const startValue = previousValue.value
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / options.duration, 1)
      
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4)
      
      displayValue.value = Number(
        (startValue + (newVal - startValue) * eased).toFixed(options.decimals)
      )
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.value = newVal
      }
    }
    
    requestAnimationFrame(animate)
  })
  
  return displayValue
}
```

### Temperature Graph Drawing

```typescript
// D3 line drawing animation
const animateTemperatureLine = (pathElement: SVGPathElement) => {
  const length = pathElement.getTotalLength()
  
  // Set up initial state
  pathElement.style.strokeDasharray = `${length}`
  pathElement.style.strokeDashoffset = `${length}`
  
  // Animate
  gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration: 1.5,
    ease: 'power2.inOut'
  })
}

// Area fill fade in
const animateAreaFill = (areaElement: SVGPathElement) => {
  gsap.fromTo(areaElement,
    { opacity: 0 },
    { 
      opacity: 1, 
      duration: 0.8, 
      delay: 0.5,
      ease: 'power2.out'
    }
  )
}
```

### Timeline Scrubber

```typescript
// Smooth scrubbing with momentum
const useTimelineScrub = () => {
  const position = ref(0)
  const velocity = ref(0)
  const isDragging = ref(false)
  
  const handleDrag = (deltaX: number) => {
    const newPosition = position.value + deltaX / containerWidth
    position.value = Math.max(0, Math.min(1, newPosition))
    velocity.value = deltaX
  }
  
  const handleRelease = () => {
    isDragging.value = false
    
    // Momentum scroll
    const decelerate = () => {
      if (Math.abs(velocity.value) < 0.1) return
      
      velocity.value *= 0.95 // Friction
      position.value = Math.max(0, Math.min(1, 
        position.value + velocity.value / containerWidth
      ))
      
      requestAnimationFrame(decelerate)
    }
    
    decelerate()
  }
}
```

### Wind Compass

```typescript
// Particle flow animation
const animateWindParticles = (
  particles: Particle[],
  windSpeed: number,
  windDirection: number
) => {
  const baseSpeed = mapRange(windSpeed, 0, 100, 0.5, 5)
  const directionRad = (windDirection - 90) * (Math.PI / 180)
  
  particles.forEach((particle, i) => {
    // Stagger start positions
    const delay = i * 0.1
    
    gsap.to(particle, {
      x: `+=${Math.cos(directionRad) * 100}`,
      y: `+=${Math.sin(directionRad) * 100}`,
      opacity: 0,
      duration: 2 / baseSpeed,
      delay,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        // Reset to start position
        particle.x = centerX + (Math.random() - 0.5) * 20
        particle.y = centerY + (Math.random() - 0.5) * 20
        particle.opacity = 1
      }
    })
  })
}
```

### UV Gauge Needle

```typescript
// Animated gauge needle
const animateUVNeedle = (needle: HTMLElement, uvIndex: number) => {
  // Map UV 0-11+ to angle -90 to 90
  const angle = mapRange(Math.min(uvIndex, 11), 0, 11, -90, 90)
  
  gsap.to(needle, {
    rotation: angle,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  })
}
```

---

## Weather Effects

### Rain Particles (Three.js)

```typescript
// Rain particle system
const createRainSystem = (scene: THREE.Scene, intensity: number) => {
  const particleCount = Math.floor(intensity * 1000)
  const geometry = new THREE.BufferGeometry()
  
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100      // x
    positions[i * 3 + 1] = Math.random() * 100          // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50   // z
    velocities[i] = 0.5 + Math.random() * 0.5           // fall speed
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const material = new THREE.PointsMaterial({
    color: 0x8899aa,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  })
  
  const rain = new THREE.Points(geometry, material)
  scene.add(rain)
  
  // Animation loop
  const animate = () => {
    const positions = geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= velocities[i] // Fall down
      
      // Reset when below ground
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 50
        // Trigger splash effect at impact point
      }
    }
    
    geometry.attributes.position.needsUpdate = true
    requestAnimationFrame(animate)
  }
  
  animate()
  
  return rain
}
```

### Snow Particles

```typescript
// Gentler snow with drift
const createSnowSystem = (scene: THREE.Scene, intensity: number) => {
  const particleCount = Math.floor(intensity * 500)
  
  // Use instanced mesh for performance
  const geometry = new THREE.CircleGeometry(0.05, 6)
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  })
  
  const snow = new THREE.InstancedMesh(geometry, material, particleCount)
  
  // Animation with gentle drift
  const animate = (time: number) => {
    const matrix = new THREE.Matrix4()
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.sin(time * 0.001 + i) * 0.5 // Horizontal drift
      const y = -((time * 0.02 + i * 10) % 100)  // Fall
      const z = Math.cos(time * 0.001 + i) * 0.3 // Depth drift
      
      matrix.setPosition(x + positions[i].x, y, z + positions[i].z)
      snow.setMatrixAt(i, matrix)
    }
    
    snow.instanceMatrix.needsUpdate = true
    requestAnimationFrame(() => animate(performance.now()))
  }
  
  animate(0)
  return snow
}
```

### Lightning Flash

```typescript
// Lightning effect
const triggerLightning = () => {
  const overlay = document.querySelector('.lightning-overlay')
  
  gsap.timeline()
    // Quick flash
    .to(overlay, { opacity: 0.8, duration: 0.05 })
    .to(overlay, { opacity: 0, duration: 0.1 })
    // Second flash (optional)
    .to(overlay, { opacity: 0.5, duration: 0.05 }, '+=0.1')
    .to(overlay, { opacity: 0, duration: 0.15 })
  
  // Thunder sound (delayed for realism)
  setTimeout(() => {
    playSound('thunder')
    triggerHaptic('thunder')
  }, 500 + Math.random() * 2000)
}

// Random lightning during storms
const startLightningLoop = () => {
  const scheduleNext = () => {
    const delay = 3000 + Math.random() * 10000 // 3-13 seconds
    setTimeout(() => {
      triggerLightning()
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}
```

### Fog Shader

```glsl
// fog.frag
uniform float uTime;
uniform vec2 uMouse;
uniform float uDensity;
uniform vec3 uColor;

varying vec2 vUv;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
// ... full noise implementation

void main() {
  vec2 uv = vUv;
  
  // Mouse influence
  vec2 mouseInfluence = (uMouse - 0.5) * 0.1;
  uv += mouseInfluence;
  
  // Multi-layer noise for depth
  float noise1 = snoise(vec3(uv * 2.0, uTime * 0.1)) * 0.5;
  float noise2 = snoise(vec3(uv * 4.0, uTime * 0.15)) * 0.25;
  float noise3 = snoise(vec3(uv * 8.0, uTime * 0.2)) * 0.125;
  
  float fog = noise1 + noise2 + noise3;
  fog = smoothstep(0.0, 1.0, fog * uDensity + 0.5);
  
  gl_FragColor = vec4(uColor, fog * 0.3);
}
```

### Sky Color Transitions

```typescript
// Smooth sky gradient transitions
const transitionSkyColors = (
  from: { start: string; end: string },
  to: { start: string; end: string },
  duration: number
) => {
  gsap.to(':root', {
    '--sky-start': to.start,
    '--sky-end': to.end,
    duration,
    ease: 'power2.inOut'
  })
}

// Time-of-day color mapping
const skyColors = {
  night: { start: '#0f0f23', end: '#1a1a2e' },
  dawn: { start: '#ff6b6b', end: '#4ecdc4' },
  morning: { start: '#87ceeb', end: '#1e90ff' },
  noon: { start: '#87ceeb', end: '#0066cc' },
  afternoon: { start: '#ffd93d', end: '#ff6b6b' },
  dusk: { start: '#ff6b6b', end: '#4a0080' },
  evening: { start: '#2d1f3d', end: '#0f0f23' }
}
```

---

## Page Transitions

### City Portal Transition

```typescript
// Full city change transition
const transitionToCity = async (newCity: City) => {
  const tl = gsap.timeline()
  
  // Phase 1: Current content zooms and blurs
  tl.to('.weather-content', {
    scale: 1.5,
    filter: 'blur(20px)',
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  })
  
  // Phase 2: Particle acceleration
  tl.to('.weather-canvas', {
    '--particle-speed': 10,
    duration: 0.3
  }, '-=0.2')
  
  // Fetch data during animation
  const dataPromise = fetchWeather(newCity)
  
  // Phase 3: Color shift
  tl.to(':root', {
    '--sky-start': newCity.skyColors.start,
    '--sky-end': newCity.skyColors.end,
    duration: 0.4,
    ease: 'power2.inOut'
  }, '-=0.2')
  
  // Wait for data
  await dataPromise
  
  // Phase 4: Normalize particles
  tl.to('.weather-canvas', {
    '--particle-speed': 1,
    duration: 0.3
  })
  
  // Phase 5: New content emerges
  tl.fromTo('.weather-content',
    {
      scale: 0.8,
      filter: 'blur(10px)',
      opacity: 0
    },
    {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }
  )
  
  // Phase 6: Cards stagger in
  tl.fromTo('.weather-card',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.4,
      ease: 'power2.out'
    },
    '-=0.3'
  )
  
  return tl
}
```

### Theme Transition

```typescript
// Smooth theme change
const transitionTheme = (newTheme: Theme) => {
  // Add transition class
  document.documentElement.classList.add('theme-transitioning')
  
  // Change theme
  document.documentElement.setAttribute('data-theme', newTheme)
  
  // Animate specific elements
  gsap.fromTo('.theme-sensitive',
    { opacity: 0.5 },
    { opacity: 1, duration: 0.5, stagger: 0.02 }
  )
  
  // Remove transition class
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
  }, 500)
}
```

```css
.theme-transitioning,
.theme-transitioning * {
  transition: 
    background-color 0.5s ease,
    color 0.5s ease,
    border-color 0.5s ease !important;
}
```

---

## Performance Guidelines

### GPU-Accelerated Properties Only

```css
/* ✅ DO - GPU accelerated */
.animate-good {
  transform: translateX(100px);
  opacity: 0.5;
  filter: blur(10px);
}

/* ❌ DON'T - Triggers layout */
.animate-bad {
  left: 100px;
  width: 200px;
  margin-left: 50px;
}
```

### Will-Change Hints

```css
/* Use sparingly - only on elements that WILL animate */
.weather-card {
  will-change: transform;
}

.weather-canvas {
  will-change: transform, opacity;
}

/* Remove after animation */
.animation-complete {
  will-change: auto;
}
```

### Debounce & Throttle

```typescript
// Throttle mouse move handlers
const throttledMouseMove = throttle((e: MouseEvent) => {
  updateParallax(e)
}, 16) // ~60fps

// Debounce resize handlers
const debouncedResize = debounce(() => {
  recalculateLayout()
}, 100)
```

### Conditional Animations

```typescript
// Reduce particles on mobile
const particleCount = computed(() => {
  if (isMobile.value) return 300
  if (isTablet.value) return 600
  return 1000
})

// Skip animations when tab not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause()
  } else {
    gsap.globalTimeline.resume()
  }
})
```

### Animation Cleanup

```typescript
// Always clean up GSAP animations
onUnmounted(() => {
  gsap.killTweensOf('.weather-card')
  gsap.killTweensOf('.weather-canvas')
  timeline.kill()
})
```

### Performance Monitoring

```typescript
// Monitor frame rate
const monitorPerformance = () => {
  let frames = 0
  let lastTime = performance.now()
  
  const checkFPS = () => {
    frames++
    const now = performance.now()
    
    if (now - lastTime >= 1000) {
      const fps = frames
      frames = 0
      lastTime = now
      
      // Reduce effects if FPS drops
      if (fps < 30) {
        reduceAnimationComplexity()
      }
    }
    
    requestAnimationFrame(checkFPS)
  }
  
  checkFPS()
}
```

---

## Animation Cheat Sheet

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Button hover | 150ms | ease-out | mouseenter |
| Button press | 50ms | ease-in | mousedown |
| Card hover | 300ms | ease-out | mouseenter |
| Drawer open | 500ms | power3.out | click |
| Drawer close | 400ms | power3.inOut | click/escape |
| Number count | 1000ms | power4.out | value change |
| Card entrance | 600ms | power3.out | page load |
| Card stagger | 100ms | - | each card |
| Graph draw | 1500ms | power2.inOut | scroll reveal |
| City transition | 1000ms | mixed | city change |
| Theme change | 500ms | power2.inOut | theme toggle |
| Lightning flash | 150ms | linear | random |
| Rain particle | infinite | linear | weather state |
| Fog drift | infinite | sine.inOut | weather state |

---

*Animation Guide Version: 2.0.0*
*Last Updated: 2025-01-04*
