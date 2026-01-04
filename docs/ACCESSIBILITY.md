# WeatherVue 2.0 - Accessibility Guide

> Comprehensive accessibility requirements and implementation patterns

## Table of Contents

1. [Accessibility Philosophy](#accessibility-philosophy)
2. [WCAG Compliance](#wcag-compliance)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Screen Reader Support](#screen-reader-support)
5. [Visual Accessibility](#visual-accessibility)
6. [Motion & Animation](#motion--animation)
7. [Alternative Modes](#alternative-modes)
8. [Testing Checklist](#testing-checklist)

---

## Accessibility Philosophy

### Core Principles

1. **Accessibility is not an afterthought** - It's built into every component from day one
2. **Multiple modalities** - Support visual, auditory, and tactile interaction
3. **Progressive enhancement** - Core functionality works without JavaScript
4. **User control** - Users can customize their experience

### Target Standards

- **WCAG 2.1 Level AA** (minimum)
- **WCAG 2.1 Level AAA** (where feasible)
- **ARIA 1.2** best practices

---

## WCAG Compliance

### Perceivable (Principle 1)

#### 1.1 Text Alternatives

```html
<!-- All images have alt text -->
<img src="weather-icon.svg" alt="Partly cloudy with chance of rain" />

<!-- Decorative images are hidden -->
<img src="decoration.svg" alt="" aria-hidden="true" />

<!-- Complex visualizations have descriptions -->
<figure>
  <div class="temperature-graph" role="img" aria-label="Temperature over 24 hours, 
    ranging from 15°C at 6 AM to 28°C at 2 PM, dropping to 18°C by midnight">
    <!-- D3 chart -->
  </div>
  <figcaption class="sr-only">
    Detailed temperature forecast showing hourly temperatures...
  </figcaption>
</figure>
```

#### 1.2 Time-based Media

- Ambient audio has visual equivalents
- Sonification mode has visual feedback
- All audio is optional and off by default

#### 1.3 Adaptable Content

```html
<!-- Semantic structure -->
<main>
  <header>
    <h1>Weather in Rome</h1>
  </header>
  
  <section aria-labelledby="current-heading">
    <h2 id="current-heading">Current Conditions</h2>
    <!-- content -->
  </section>
  
  <section aria-labelledby="forecast-heading">
    <h2 id="forecast-heading">7-Day Forecast</h2>
    <!-- content -->
  </section>
</main>

<!-- Landmarks -->
<nav aria-label="Main navigation">...</nav>
<aside aria-label="Settings panel">...</aside>
```

#### 1.4 Distinguishable

| Element | Contrast Ratio | Requirement |
|---------|---------------|-------------|
| Body text | 7:1+ | AAA |
| Large text (>18px bold) | 4.5:1+ | AAA |
| UI components | 3:1+ | AA |
| Focus indicators | 3:1+ | AA |

```css
/* Ensure sufficient contrast */
:root {
  --text-primary: #000000;      /* On white: 21:1 */
  --text-secondary: #4b5563;    /* On white: 7.5:1 */
  --text-muted: #6b7280;        /* On white: 5.3:1 - use only for large text */
}

[data-theme="dark"] {
  --text-primary: #ffffff;      /* On black: 21:1 */
  --text-secondary: #d1d5db;    /* On black: 13:1 */
  --text-muted: #9ca3af;        /* On black: 7.5:1 */
}
```

### Operable (Principle 2)

#### 2.1 Keyboard Accessible

All functionality available via keyboard:

| Action | Key(s) |
|--------|--------|
| Navigate forward | Tab |
| Navigate backward | Shift + Tab |
| Activate button/link | Enter, Space |
| Close modal/drawer | Escape |
| Navigate timeline | Arrow Left/Right |
| Jump to time | Home (start), End (end) |
| Select in dropdown | Arrow Up/Down, Enter |
| Toggle checkbox | Space |

#### 2.2 Enough Time

- No automatic content changes without user control
- Timeline scrubber pauses on interaction
- Loading states persist until action complete

#### 2.3 Seizures and Physical Reactions

```css
/* Limit flash frequency */
@keyframes lightning-flash {
  /* Max 3 flashes per second */
  0%, 5% { opacity: 1; }
  6%, 100% { opacity: 0; }
}

/* User can disable all flashing */
@media (prefers-reduced-motion: reduce) {
  .lightning-effect {
    display: none;
  }
}
```

#### 2.4 Navigable

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<!-- Page title updates with city -->
<title>Rome Weather - WeatherVue</title>

<!-- Focus order follows visual order -->
<!-- Heading hierarchy is logical -->
```

#### 2.5 Input Modalities

- Touch targets minimum 44x44px
- Pointer gestures have single-pointer alternatives
- Drag operations have click alternatives

### Understandable (Principle 3)

#### 3.1 Readable

```html
<html lang="en">
<!-- Language changes marked -->
<span lang="it">Roma, Italia</span>

<!-- Abbreviations explained -->
<abbr title="Ultraviolet Index">UV</abbr>
```

#### 3.2 Predictable

- Consistent navigation across all states
- Settings changes don't alter context unexpectedly
- Focus doesn't move unexpectedly

#### 3.3 Input Assistance

```html
<!-- Labels for all inputs -->
<label for="city-search">Search for a city</label>
<input id="city-search" type="text" 
       aria-describedby="search-hint"
       aria-invalid="false">
<span id="search-hint" class="sr-only">
  Type a city name and select from suggestions
</span>

<!-- Error messages are clear -->
<div role="alert" aria-live="assertive">
  Could not find "Roomee". Did you mean "Rome"?
</div>
```

### Robust (Principle 4)

#### 4.1 Compatible

- Valid HTML5
- ARIA roles used correctly
- Works with assistive technologies

---

## Keyboard Navigation

### Focus Management

```typescript
// Focus trap for modals/drawers
const useFocusTrap = (containerRef: Ref<HTMLElement>) => {
  const focusableSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  
  const trapFocus = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    
    const focusable = containerRef.value.querySelectorAll(focusableSelector)
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
  
  onMounted(() => document.addEventListener('keydown', trapFocus))
  onUnmounted(() => document.removeEventListener('keydown', trapFocus))
}
```

### Focus Indicators

```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Remove default outline when using focus-visible */
:focus:not(:focus-visible) {
  outline: none;
}

/* Enhanced focus for key elements */
.btn:focus-visible,
.card:focus-visible {
  outline-width: 3px;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.3);
}
```

### Roving Tabindex

For composite widgets like timeline:

```typescript
// TimelineScrubber keyboard navigation
const useRovingTabindex = (items: Ref<HTMLElement[]>, currentIndex: Ref<number>) => {
  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        currentIndex.value = Math.min(currentIndex.value + 1, items.value.length - 1)
        items.value[currentIndex.value].focus()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        currentIndex.value = Math.max(currentIndex.value - 1, 0)
        items.value[currentIndex.value].focus()
        break
      case 'Home':
        e.preventDefault()
        currentIndex.value = 0
        items.value[0].focus()
        break
      case 'End':
        e.preventDefault()
        currentIndex.value = items.value.length - 1
        items.value[currentIndex.value].focus()
        break
    }
  }
  
  return { handleKeydown }
}
```

---

## Screen Reader Support

### Live Regions

```html
<!-- Weather updates announced -->
<div id="weather-announcer" 
     role="status" 
     aria-live="polite" 
     aria-atomic="true"
     class="sr-only">
</div>

<script>
const announceWeather = (weather: CurrentWeather) => {
  const announcer = document.getElementById('weather-announcer')
  announcer.textContent = `Weather updated. ${weather.city}: 
    ${weather.temperature} degrees ${weather.unit}, 
    ${weather.condition}. 
    Feels like ${weather.feelsLike} degrees.`
}
</script>
```

### Descriptive Labels

```html
<!-- Icon buttons need labels -->
<button aria-label="Open settings" class="icon-btn">
  <SettingsIcon aria-hidden="true" />
</button>

<!-- Toggle buttons show state -->
<button 
  aria-label="Dark mode"
  aria-pressed="true"
  class="theme-toggle"
>
  <MoonIcon aria-hidden="true" />
</button>

<!-- Expandable sections -->
<button 
  aria-expanded="false"
  aria-controls="hourly-forecast"
>
  Hourly Forecast
</button>
<section id="hourly-forecast" hidden>...</section>
```

### Data Visualization Descriptions

```html
<!-- Temperature graph -->
<div 
  role="img"
  aria-label="24-hour temperature forecast"
  aria-describedby="temp-graph-desc"
>
  <!-- SVG chart -->
</div>
<div id="temp-graph-desc" class="sr-only">
  Temperature starts at 18 degrees Celsius at midnight,
  rises to 24 degrees by 8 AM,
  peaks at 29 degrees at 2 PM,
  then falls to 20 degrees by midnight.
  Rain is expected between 4 PM and 7 PM.
</div>

<!-- Provide data table alternative -->
<details class="sr-only">
  <summary>View temperature data as table</summary>
  <table>
    <thead>
      <tr><th>Time</th><th>Temperature</th><th>Conditions</th></tr>
    </thead>
    <tbody>
      <tr><td>12 AM</td><td>18°C</td><td>Clear</td></tr>
      <!-- ... -->
    </tbody>
  </table>
</details>
```

### Screen Reader Utilities

```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus (skip links) */
.sr-only-focusable:focus,
.sr-only-focusable:focus-within {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Visual Accessibility

### Color Independence

Never rely on color alone:

```html
<!-- Bad: Color only -->
<span class="text-red-500">Error</span>

<!-- Good: Color + icon + text -->
<span class="text-red-500">
  <AlertIcon aria-hidden="true" />
  Error: City not found
</span>

<!-- Weather conditions: icon + text -->
<div class="weather-condition">
  <SunIcon aria-hidden="true" />
  <span>Clear Sky</span>
</div>
```

### Text Sizing

```css
/* Use relative units */
html {
  font-size: 100%; /* Respects user preference */
}

body {
  font-size: 1rem;
  line-height: 1.5;
}

/* Support up to 200% zoom */
@media (min-width: 320px) {
  /* Content reflows, no horizontal scroll */
}
```

### High Contrast Support

```css
/* Windows High Contrast Mode */
@media (forced-colors: active) {
  .btn {
    border: 2px solid ButtonText;
  }
  
  .card {
    border: 1px solid CanvasText;
  }
  
  .weather-icon {
    forced-color-adjust: none; /* Preserve weather colors */
  }
}
```

### Dark Mode

```css
/* Automatic dark mode */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-body: #000000;
    --text-primary: #ffffff;
    /* ... */
  }
}
```

---

## Motion & Animation

### Reduced Motion

```css
/* Global reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```typescript
// Composable for reduced motion
const useReducedMotion = () => {
  const prefersReducedMotion = ref(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  
  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }
    mq.addEventListener('change', handler)
    onUnmounted(() => mq.removeEventListener('change', handler))
  })
  
  return { prefersReducedMotion }
}

// Usage in components
const { prefersReducedMotion } = useReducedMotion()

const animationDuration = computed(() => 
  prefersReducedMotion.value ? 0 : 1000
)
```

### Safe Animation Patterns

```typescript
// Respect user preference in GSAP
const animateElement = (el: HTMLElement, prefersReducedMotion: boolean) => {
  if (prefersReducedMotion) {
    // Instant state change
    gsap.set(el, { opacity: 1, y: 0 })
  } else {
    // Animated transition
    gsap.fromTo(el, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
  }
}
```

### WebGL Fallback

```vue
<template>
  <div class="weather-background">
    <!-- WebGL for capable devices with motion enabled -->
    <WeatherCanvas v-if="supportsWebGL && !prefersReducedMotion" />
    
    <!-- CSS gradient fallback -->
    <div v-else class="gradient-background" :style="gradientStyle" />
  </div>
</template>
```

---

## Alternative Modes

### Terminal Theme (High Contrast)

```css
[data-theme="terminal"] {
  /* Maximum contrast */
  --bg-body: #0a0a0a;
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --accent: #00ff00;
  
  /* Monospace for clarity */
  --font-family: 'JetBrains Mono', monospace;
  
  /* Clear borders */
  --border-style: dashed;
  --border-color: #00ff00;
}

[data-theme="terminal"] * {
  font-family: var(--font-family) !important;
  border-radius: 0 !important;
}

[data-theme="terminal"] .card {
  border: 1px dashed var(--border-color);
  background: transparent;
}
```

### Sonification Mode

```typescript
// Audio representation of weather data
const useSonification = () => {
  const audioContext = ref<AudioContext | null>(null)
  
  const init = () => {
    audioContext.value = new AudioContext()
  }
  
  const playTemperature = (temp: number) => {
    if (!audioContext.value) return
    
    const oscillator = audioContext.value.createOscillator()
    const gain = audioContext.value.createGain()
    
    // Map temperature to frequency
    // -20°C = 200Hz, 40°C = 800Hz
    const frequency = mapRange(temp, -20, 40, 200, 800)
    
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.value = 0.1
    
    oscillator.connect(gain)
    gain.connect(audioContext.value.destination)
    
    oscillator.start()
    oscillator.stop(audioContext.value.currentTime + 0.5)
  }
  
  const playWeatherAmbience = (weatherType: WeatherType) => {
    // Play corresponding ambient sound
    const sounds = {
      rain: '/sounds/rain-ambient.mp3',
      storm: '/sounds/thunder.mp3',
      wind: '/sounds/wind-ambient.mp3'
    }
    // ...
  }
  
  return { init, playTemperature, playWeatherAmbience }
}
```

### Text-Only Mode

For extremely low bandwidth or assistive technology:

```html
<!-- Provide plain text alternative -->
<noscript>
  <style>
    .weather-canvas, .animated-graph { display: none; }
    .text-fallback { display: block; }
  </style>
</noscript>

<div class="text-fallback" hidden>
  <h1>Weather in Rome, Italy</h1>
  <p>Temperature: 24°C (feels like 26°C)</p>
  <p>Conditions: Partly Cloudy</p>
  <p>Wind: 15 km/h from the Northeast</p>
  <p>Humidity: 65%</p>
  <p>UV Index: 7 (High)</p>
</div>
```

---

## Testing Checklist

### Automated Testing

- [ ] Run axe-core on all pages
- [ ] Run Lighthouse accessibility audit
- [ ] Validate HTML (no duplicate IDs, valid ARIA)
- [ ] Check color contrast ratios

### Manual Testing

#### Keyboard
- [ ] Tab through entire page
- [ ] All interactive elements focusable
- [ ] Focus order logical
- [ ] Focus visible at all times
- [ ] Escape closes modals/drawers
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in widgets

#### Screen Reader (test with multiple)
- [ ] VoiceOver (macOS/iOS)
- [ ] NVDA (Windows)
- [ ] TalkBack (Android)
- [ ] Content read in logical order
- [ ] Buttons/links announced correctly
- [ ] Form labels associated
- [ ] Live regions announce updates
- [ ] Images have alt text
- [ ] Graphs have descriptions

#### Visual
- [ ] 200% zoom - no horizontal scroll
- [ ] 400% zoom - content still usable
- [ ] High contrast mode works
- [ ] Dark mode readable
- [ ] Color not sole indicator

#### Motion
- [ ] Reduced motion preference respected
- [ ] No content flashes >3 times/second
- [ ] Animations can be paused/stopped

#### Mobile
- [ ] Touch targets 44x44px minimum
- [ ] Gestures have alternatives
- [ ] Orientation not locked
- [ ] Zoom not disabled

### Assistive Technology Compatibility

| Technology | Status | Notes |
|------------|--------|-------|
| VoiceOver macOS | ✓ | Tested |
| VoiceOver iOS | ✓ | Tested |
| NVDA | ✓ | Tested |
| JAWS | ○ | To test |
| TalkBack | ○ | To test |
| Dragon | ○ | To test |
| Switch Control | ○ | To test |

### WCAG Checklist Summary

| Criterion | Level | Status |
|-----------|-------|--------|
| 1.1.1 Non-text Content | A | ✓ |
| 1.2.1 Audio-only/Video-only | A | N/A |
| 1.3.1 Info and Relationships | A | ✓ |
| 1.3.2 Meaningful Sequence | A | ✓ |
| 1.3.3 Sensory Characteristics | A | ✓ |
| 1.4.1 Use of Color | A | ✓ |
| 1.4.2 Audio Control | A | ✓ |
| 1.4.3 Contrast (Minimum) | AA | ✓ |
| 1.4.4 Resize Text | AA | ✓ |
| 1.4.5 Images of Text | AA | ✓ |
| 1.4.10 Reflow | AA | ✓ |
| 1.4.11 Non-text Contrast | AA | ✓ |
| 1.4.12 Text Spacing | AA | ✓ |
| 1.4.13 Content on Hover | AA | ✓ |
| 2.1.1 Keyboard | A | ✓ |
| 2.1.2 No Keyboard Trap | A | ✓ |
| 2.1.4 Character Key Shortcuts | A | ✓ |
| 2.2.1 Timing Adjustable | A | ✓ |
| 2.2.2 Pause, Stop, Hide | A | ✓ |
| 2.3.1 Three Flashes | A | ✓ |
| 2.4.1 Bypass Blocks | A | ✓ |
| 2.4.2 Page Titled | A | ✓ |
| 2.4.3 Focus Order | A | ✓ |
| 2.4.4 Link Purpose | A | ✓ |
| 2.4.5 Multiple Ways | AA | ✓ |
| 2.4.6 Headings and Labels | AA | ✓ |
| 2.4.7 Focus Visible | AA | ✓ |
| 2.5.1 Pointer Gestures | A | ✓ |
| 2.5.2 Pointer Cancellation | A | ✓ |
| 2.5.3 Label in Name | A | ✓ |
| 2.5.4 Motion Actuation | A | ✓ |
| 3.1.1 Language of Page | A | ✓ |
| 3.1.2 Language of Parts | AA | ✓ |
| 3.2.1 On Focus | A | ✓ |
| 3.2.2 On Input | A | ✓ |
| 3.2.3 Consistent Navigation | AA | ✓ |
| 3.2.4 Consistent Identification | AA | ✓ |
| 3.3.1 Error Identification | A | ✓ |
| 3.3.2 Labels or Instructions | A | ✓ |
| 3.3.3 Error Suggestion | AA | ✓ |
| 3.3.4 Error Prevention | AA | ✓ |
| 4.1.1 Parsing | A | ✓ |
| 4.1.2 Name, Role, Value | A | ✓ |
| 4.1.3 Status Messages | AA | ✓ |

---

*Accessibility Guide Version: 2.0.0*
*Last Updated: 2025-01-04*
