# WeatherVue 2.0 - System Architecture

> Award-winning weather application with immersive atmospheric design

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Data Flow](#data-flow)
7. [API Integration](#api-integration)
8. [Performance Architecture](#performance-architecture)
9. [Build & Deployment](#build--deployment)

---

## Overview

### Design Philosophy: "Atmospheric Brutalism"

WeatherVue 2.0 combines **editorial typography** with **organic, living weather effects**. The tension between rigid grids and fluid atmospheric motion creates the artistic feel that wins design awards.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Vue 3 + Composition API | Reactive, composable, excellent TypeScript support |
| Build Tool | Vite | Fast HMR, native ESM, optimized builds |
| Language | TypeScript (strict) | Type safety, better DX, portfolio signal |
| Styling | Tailwind CSS + CSS Variables | Utility-first with dynamic theming |
| State | Pinia | Official Vue store, devtools integration |
| Animation | GSAP + Three.js | Industry-standard motion + WebGL |
| Data Viz | D3.js | Powerful, customizable charts |
| Icons | Lucide Vue | Tree-shakeable, consistent |

---

## Technology Stack

### Core Dependencies

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "@vueuse/core": "^10.7.0",
    "three": "^0.160.0",
    "@types/three": "^0.160.0",
    "gsap": "^3.12.0",
    "d3": "^7.8.0",
    "lucide-vue-next": "^0.300.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "@vitejs/plugin-vue": "^4.5.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@vue/tsconfig": "^0.5.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

### Browser Support

- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

---

## Project Structure

```
weathervue/
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # This file
│   ├── DESIGN_SYSTEM.md           # Design tokens & guidelines
│   ├── FEATURES.md                # Feature specifications
│   ├── IMPLEMENTATION_PLAN.md     # Development roadmap
│   ├── ACCESSIBILITY.md           # A11y requirements
│   └── ANIMATIONS.md              # Motion design specs
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json              # PWA manifest
│
├── src/
│   ├── assets/
│   │   ├── fonts/                 # Self-hosted fonts
│   │   │   ├── playfair-display/
│   │   │   └── inter-variable/
│   │   ├── sounds/                # Ambient audio files
│   │   │   ├── rain-ambient.mp3
│   │   │   ├── wind-ambient.mp3
│   │   │   └── thunder.mp3
│   │   └── images/
│   │       └── city-blurhash/     # BlurHash placeholders
│   │
│   ├── components/
│   │   ├── canvas/                # WebGL components
│   │   │   ├── WeatherCanvas.vue  # Three.js atmosphere
│   │   │   ├── ParticleSystem.ts  # Rain/snow particles
│   │   │   └── shaders/
│   │   │       ├── fog.vert
│   │   │       ├── fog.frag
│   │   │       ├── rain.vert
│   │   │       └── rain.frag
│   │   │
│   │   ├── ui/                    # Base UI components
│   │   │   ├── MagneticButton.vue
│   │   │   ├── GlassmorphicCard.vue
│   │   │   ├── AnimatedNumber.vue
│   │   │   ├── SkeletonLoader.vue
│   │   │   ├── IconWrapper.vue
│   │   │   └── index.ts           # Barrel export
│   │   │
│   │   ├── weather/               # Weather-specific components
│   │   │   ├── WeatherCard.vue
│   │   │   ├── TemperatureGraph.vue
│   │   │   ├── WindCompass.vue
│   │   │   ├── TimelineScrubber.vue
│   │   │   ├── SunriseSunsetArc.vue
│   │   │   ├── UVIndexGauge.vue
│   │   │   ├── PrecipitationBar.vue
│   │   │   ├── WeeklyForecast.vue
│   │   │   ├── HourlyForecast.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── SettingsDrawer.vue
│   │   │   ├── BottomNav.vue
│   │   │   ├── SplashScreen.vue
│   │   │   └── index.ts
│   │   │
│   │   └── search/                # City search
│   │       ├── CitySearch.vue
│   │       ├── CitySearchResults.vue
│   │       └── RecentCities.vue
│   │
│   ├── composables/               # Vue composables
│   │   ├── useWeather.ts          # Weather data fetching
│   │   ├── useGeolocation.ts      # Browser geolocation
│   │   ├── useTheme.ts            # Theme management
│   │   ├── useMagneticEffect.ts   # Magnetic cursor
│   │   ├── useParallax.ts         # Parallax effects
│   │   ├── useHaptics.ts          # Vibration API
│   │   ├── useAudio.ts            # Ambient sounds
│   │   ├── useSonification.ts     # Data sonification
│   │   ├── useReducedMotion.ts    # Motion preferences
│   │   └── index.ts
│   │
│   ├── stores/                    # Pinia stores
│   │   ├── weatherStore.ts        # Weather data state
│   │   ├── locationStore.ts       # City/location state
│   │   ├── settingsStore.ts       # User preferences
│   │   └── index.ts
│   │
│   ├── services/                  # API services
│   │   ├── weatherApi.ts          # Open-Meteo integration
│   │   ├── geocodingApi.ts        # City search API
│   │   ├── translationApi.ts      # Azure Translator
│   │   └── cache.ts               # SWR-like caching
│   │
│   ├── types/                     # TypeScript types
│   │   ├── weather.ts             # Weather data types
│   │   ├── location.ts            # Location types
│   │   ├── theme.ts               # Theme types
│   │   └── index.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── animations.ts          # GSAP helpers
│   │   ├── interpolation.ts       # Data interpolation
│   │   ├── formatters.ts          # Number/date formatting
│   │   ├── weatherCodes.ts        # WMO code mapping
│   │   └── constants.ts           # App constants
│   │
│   ├── styles/                    # Global styles
│   │   ├── main.css               # Tailwind imports
│   │   ├── variables.css          # CSS custom properties
│   │   ├── animations.css         # Keyframe animations
│   │   ├── fonts.css              # Font-face declarations
│   │   └── utilities.css          # Custom utilities
│   │
│   ├── App.vue                    # Root component
│   ├── main.ts                    # App entry point
│   └── vite-env.d.ts              # Vite type declarations
│
├── .env.example                   # Environment template
├── .eslintrc.cjs                  # ESLint config
├── .prettierrc                    # Prettier config
├── index.html                     # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Component Architecture

### Component Hierarchy

```
App.vue
├── SplashScreen.vue (conditional)
├── WeatherCanvas.vue (WebGL background)
├── AppHeader.vue
│   ├── Logo + ThemeToggle
│   └── SettingsButton
├── main content
│   ├── CitySearch.vue
│   │   ├── SearchInput
│   │   ├── CitySearchResults.vue
│   │   └── RecentCities.vue
│   ├── CurrentWeather section
│   │   ├── AnimatedNumber.vue (temperature)
│   │   └── WeatherCard.vue (conditions)
│   ├── TimelineScrubber.vue
│   ├── TemperatureGraph.vue (D3)
│   ├── Weather Metrics Grid
│   │   ├── WindCompass.vue
│   │   ├── UVIndexGauge.vue
│   │   ├── PrecipitationBar.vue
│   │   ├── SunriseSunsetArc.vue
│   │   └── WeatherCard.vue (humidity, pressure, etc.)
│   ├── HourlyForecast.vue
│   └── WeeklyForecast.vue
├── SettingsDrawer.vue (off-canvas)
│   ├── ThemeSelector
│   ├── UnitsSelector
│   ├── AccessibilityToggles
│   └── AudioSettings
└── BottomNav.vue (mobile only)
```

### Component Communication

```
┌─────────────────────────────────────────────────────────────┐
│                        Pinia Stores                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ weatherStore│  │locationStore│  │settingsStore│          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
└─────────┼────────────────┼────────────────┼──────────────────┘
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │ Weather   │    │ City      │    │ Theme     │
    │ Components│    │ Search    │    │ Components│
    └───────────┘    └───────────┘    └───────────┘
```

### Component Props Pattern

```typescript
// All components follow this pattern
interface Props {
  // Required props first
  value: number
  
  // Optional props with defaults
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  
  // Callbacks
  onChange?: (value: number) => void
}

// Emits are typed
interface Emits {
  (e: 'update:value', value: number): void
  (e: 'animationComplete'): void
}
```

---

## State Management

### Store Structure

#### weatherStore.ts
```typescript
interface WeatherState {
  // Current conditions
  current: CurrentWeather | null
  
  // Forecasts
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  
  // Loading states
  isLoading: boolean
  error: Error | null
  
  // Cache metadata
  lastFetched: Date | null
  
  // Timeline state
  timelinePosition: number // 0-1 for 24h scrub
  interpolatedWeather: CurrentWeather | null
}

interface WeatherActions {
  fetchWeather(lat: number, lng: number): Promise<void>
  setTimelinePosition(position: number): void
  clearError(): void
}
```

#### locationStore.ts
```typescript
interface LocationState {
  // Current location
  currentCity: City | null
  coordinates: Coordinates | null
  
  // Search
  searchQuery: string
  searchResults: City[]
  isSearching: boolean
  
  // History
  recentCities: City[]
  favoriteCities: City[]
  
  // Geolocation
  isGeolocating: boolean
  geoError: GeolocationError | null
}
```

#### settingsStore.ts
```typescript
interface SettingsState {
  // Appearance
  theme: 'light' | 'dark' | 'system' | 'terminal'
  reducedMotion: boolean
  
  // Units
  temperatureUnit: 'celsius' | 'fahrenheit'
  speedUnit: 'kmh' | 'mph' | 'ms'
  
  // Accessibility
  sonificationEnabled: boolean
  highContrast: boolean
  
  // Audio
  ambientAudioEnabled: boolean
  ambientVolume: number
  
  // Haptics
  hapticsEnabled: boolean
}
```

---

## Data Flow

### Weather Data Fetch Flow

```
User Action (city select / geolocation)
         │
         ▼
┌─────────────────────┐
│  locationStore      │
│  setCurrentCity()   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  weatherStore       │
│  fetchWeather()     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  cache.ts           │────▶│  Return cached data │
│  checkCache()       │     │  if fresh (<5min)   │
└──────────┬──────────┘     └─────────────────────┘
           │ cache miss
           ▼
┌─────────────────────┐
│  weatherApi.ts      │
│  fetchFromOpenMeteo │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Transform data     │
│  to internal types  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Update store +     │
│  Update cache       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Components react   │
│  via computed props │
└─────────────────────┘
```

### Timeline Scrub Data Flow

```
User drags TimelineScrubber
         │
         ▼
┌─────────────────────────┐
│  Emit position (0-1)     │
│  Debounced to 16ms       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  weatherStore           │
│  setTimelinePosition()  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Computed: interpolate  │
│  between hourly points  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  All components react:  │
│  - Temperature updates  │
│  - Canvas colors shift  │
│  - Graph marker moves   │
└─────────────────────────┘
```

---

## API Integration

### Open-Meteo Weather API

```typescript
// Base URL
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// Current weather params
const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'rain',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index'
]

// Hourly params (for timeline)
const HOURLY_PARAMS = [
  'temperature_2m',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m'
]

// Daily params (for 7-day)
const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_probability_max'
]
```

### Open-Meteo Geocoding API

```typescript
// City search
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// Params
interface GeocodingParams {
  name: string       // Search query
  count?: number     // Max results (default 10)
  language?: string  // Result language
}
```

### Azure Translator API

```typescript
// Translation endpoint
const TRANSLATOR_URL = 'https://api.cognitive.microsofttranslator.com/translate'

// Headers required
const headers = {
  'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
  'Ocp-Apim-Subscription-Region': AZURE_REGION,
  'Content-Type': 'application/json'
}
```

---

## Performance Architecture

### Optimization Strategies

| Strategy | Implementation |
|----------|---------------|
| **Code Splitting** | Dynamic imports for heavy components (Three.js, D3) |
| **Tree Shaking** | ES modules, named exports, sideEffects: false |
| **Font Loading** | Preload critical fonts, font-display: swap |
| **Image Optimization** | BlurHash placeholders, lazy loading |
| **Caching** | SWR pattern with 5-min stale time |
| **Bundle Analysis** | vite-plugin-bundle-analyzer |

### Lazy Loading Strategy

```typescript
// Heavy components loaded on demand
const WeatherCanvas = defineAsyncComponent(() => 
  import('./components/canvas/WeatherCanvas.vue')
)

const TemperatureGraph = defineAsyncComponent(() => 
  import('./components/weather/TemperatureGraph.vue')
)

// Settings drawer loaded on interaction
const SettingsDrawer = defineAsyncComponent(() =>
  import('./components/layout/SettingsDrawer.vue')
)
```

### Performance Budgets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| Total Bundle Size | < 200KB (gzipped) |
| Main Thread Work | < 4s |

---

## Build & Deployment

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'WeatherVue',
        short_name: 'WeatherVue',
        theme_color: '#000000',
        icons: [/* ... */]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'd3': ['d3'],
          'gsap': ['gsap']
        }
      }
    }
  }
})
```

### Environment Variables

```bash
# .env.example
VITE_AZURE_API_KEY=your_azure_key
VITE_AZURE_REGION=your_region
VITE_APP_VERSION=$npm_package_version
```

### Deployment Targets

- **Primary**: Vercel (automatic Git integration)
- **Alternative**: Netlify, Cloudflare Pages
- **Preview**: Branch deploys for PR review

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| API Key Exposure | Server-side proxy for Azure API in production |
| XSS | Vue's automatic template escaping |
| CSP | Strict Content Security Policy headers |
| Dependencies | Dependabot for automated updates |

---

## Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance**: Web Vitals reporting
- **Usage**: Privacy-respecting analytics (optional)

---

*Last updated: 2025-01-04*
*Version: 2.0.0-alpha*
