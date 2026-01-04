# WeatherVue 2.0 - Design System

> A comprehensive design system for an award-winning weather application

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Effects & Treatments](#effects--treatments)
7. [Iconography](#iconography)
8. [Responsive Design](#responsive-design)

---

## Design Philosophy

### "Atmospheric Brutalism"

WeatherVue combines two contrasting design languages:

1. **Brutalist Typography**: Bold, stark, high-contrast editorial type
2. **Organic Atmosphere**: Soft, fluid, living weather effects

This tension creates visual interest and separates the app from generic weather UIs.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Data as Art** | Weather data should feel like a living canvas, not a spreadsheet |
| **Immersive** | The entire UI should reflect current weather conditions |
| **Accessible** | Beauty should never compromise usability |
| **Performant** | Smooth 60fps animations, even on mobile |
| **Delightful** | Micro-interactions that reward exploration |

---

## Color System

### Base Palette

```css
:root {
  /* Neutrals */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-300: #d4d4d8;
  --color-gray-400: #a1a1aa;
  --color-gray-500: #71717a;
  --color-gray-600: #52525b;
  --color-gray-700: #3f3f46;
  --color-gray-800: #27272a;
  --color-gray-900: #18181b;
  --color-gray-950: #09090b;
  
  /* Primary Accent */
  --color-accent: #dc2626;
  --color-accent-light: #ef4444;
  --color-accent-dark: #b91c1c;
}
```

### Semantic Colors

```css
:root {
  /* Light Theme */
  --bg-body: var(--color-white);
  --bg-card: var(--color-gray-100);
  --bg-card-hover: var(--color-gray-200);
  --bg-drawer: var(--color-gray-50);
  --bg-glass: rgba(255, 255, 255, 0.7);
  
  --text-primary: var(--color-black);
  --text-secondary: var(--color-gray-600);
  --text-muted: var(--color-gray-500);
  --text-inverse: var(--color-white);
  
  --border-default: var(--color-gray-200);
  --border-strong: var(--color-gray-400);
  
  --accent: var(--color-accent);
}

[data-theme="dark"] {
  --bg-body: var(--color-black);
  --bg-card: var(--color-gray-900);
  --bg-card-hover: var(--color-gray-800);
  --bg-drawer: var(--color-gray-950);
  --bg-glass: rgba(0, 0, 0, 0.7);
  
  --text-primary: var(--color-white);
  --text-secondary: var(--color-gray-400);
  --text-muted: var(--color-gray-500);
  --text-inverse: var(--color-black);
  
  --border-default: var(--color-gray-800);
  --border-strong: var(--color-gray-600);
}

[data-theme="terminal"] {
  --bg-body: #0a0a0a;
  --bg-card: #0f0f0f;
  --bg-card-hover: #1a1a1a;
  --bg-drawer: #050505;
  --bg-glass: rgba(0, 255, 0, 0.1);
  
  --text-primary: #00ff00;
  --text-secondary: #00cc00;
  --text-muted: #009900;
  --text-inverse: #000000;
  
  --border-default: #003300;
  --border-strong: #00ff00;
  
  --accent: #00ff00;
  
  /* Terminal-specific */
  --font-family-override: 'JetBrains Mono', monospace;
  --border-style: dashed;
}
```

### Weather-Reactive Colors

The entire UI color palette shifts based on current weather conditions:

```css
/* Clear Sky */
:root[data-weather="clear"][data-time="day"] {
  --sky-start: #87CEEB;
  --sky-end: #1E90FF;
  --atmosphere: rgba(255, 215, 0, 0.1);
  --sun-glow: rgba(255, 200, 50, 0.3);
}

:root[data-weather="clear"][data-time="night"] {
  --sky-start: #0f0f23;
  --sky-end: #1a1a2e;
  --atmosphere: rgba(100, 100, 200, 0.1);
  --moon-glow: rgba(200, 200, 255, 0.2);
}

/* Cloudy */
:root[data-weather="cloudy"] {
  --sky-start: #94a3b8;
  --sky-end: #64748b;
  --atmosphere: rgba(150, 150, 150, 0.2);
}

/* Rainy */
:root[data-weather="rain"] {
  --sky-start: #4a5568;
  --sky-end: #2d3748;
  --atmosphere: rgba(100, 150, 200, 0.2);
  --rain-color: rgba(150, 200, 255, 0.6);
}

/* Storm */
:root[data-weather="storm"] {
  --sky-start: #1a202c;
  --sky-end: #0d1117;
  --atmosphere: rgba(80, 50, 120, 0.3);
  --lightning-color: rgba(255, 255, 200, 0.9);
}

/* Snow */
:root[data-weather="snow"] {
  --sky-start: #e2e8f0;
  --sky-end: #cbd5e0;
  --atmosphere: rgba(220, 230, 240, 0.3);
  --snow-color: rgba(255, 255, 255, 0.8);
}

/* Fog */
:root[data-weather="fog"] {
  --sky-start: #d1d5db;
  --sky-end: #9ca3af;
  --atmosphere: rgba(180, 180, 180, 0.5);
  --fog-density: 0.7;
}
```

### Temperature Gradient

For temperature visualizations:

```css
:root {
  /* Freezing to Hot: -20°C to 40°C */
  --temp-freezing: #60a5fa;   /* -20°C and below */
  --temp-cold: #93c5fd;       /* -10°C */
  --temp-cool: #bfdbfe;       /* 0°C */
  --temp-mild: #fef3c7;       /* 10°C */
  --temp-warm: #fcd34d;       /* 20°C */
  --temp-hot: #f97316;        /* 30°C */
  --temp-extreme: #dc2626;    /* 40°C and above */
}
```

---

## Typography

### Font Stack

```css
:root {
  /* Display/Headlines - Playfair Display */
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  
  /* Body/UI - Inter Variable */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Monospace - JetBrains Mono */
  --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Type Scale

```css
:root {
  /* Base: 16px */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  --text-8xl: 6rem;        /* 96px */
  --text-9xl: 8rem;        /* 128px */
  
  /* Fluid display sizes */
  --text-hero: clamp(3rem, 10vw, 8rem);
  --text-display: clamp(2rem, 6vw, 4rem);
}
```

### Font Weights

```css
:root {
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### Letter Spacing

```css
:root {
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
  --tracking-mega: 0.2em;    /* For labels */
  --tracking-ultra: 0.3em;   /* For tiny caps */
}
```

### Typography Styles

| Element | Font | Size | Weight | Tracking | Transform |
|---------|------|------|--------|----------|-----------|
| Hero Temperature | Display | hero | 400 | tight | - |
| City Name | Display | display | 700 | tight | - |
| Card Value | Display | 4xl | 400 | normal | - |
| Section Label | Body | xs | 800 | ultra | uppercase |
| Card Label | Body | xs | 700 | mega | uppercase |
| Body Text | Body | base | 400 | normal | - |
| Button | Body | sm | 700 | widest | uppercase |
| Caption | Body | xs | 500 | wide | - |

### Variable Font Animations

For wind-reactive text "shivering":

```css
.text-weather-reactive {
  font-variation-settings: 'wght' var(--dynamic-weight, 400);
  transition: font-variation-settings 0.1s ease;
}

/* When windy, weight oscillates */
@keyframes text-shiver {
  0%, 100% { font-variation-settings: 'wght' 400; }
  25% { font-variation-settings: 'wght' 380; }
  75% { font-variation-settings: 'wght' 420; }
}

.windy .text-weather-reactive {
  animation: text-shiver 0.3s ease-in-out infinite;
}
```

---

## Spacing & Layout

### Spacing Scale

```css
:root {
  --space-px: 1px;
  --space-0: 0;
  --space-0.5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1.5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2.5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-3.5: 0.875rem;   /* 14px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-7: 1.75rem;      /* 28px */
  --space-8: 2rem;         /* 32px */
  --space-9: 2.25rem;      /* 36px */
  --space-10: 2.5rem;      /* 40px */
  --space-11: 2.75rem;     /* 44px */
  --space-12: 3rem;        /* 48px */
  --space-14: 3.5rem;      /* 56px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
  --space-28: 7rem;        /* 112px */
  --space-32: 8rem;        /* 128px */
}
```

### Layout Grid

```css
:root {
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  
  /* Content width */
  --content-max: 1400px;
  
  /* Grid */
  --grid-cols-mobile: 4;
  --grid-cols-tablet: 8;
  --grid-cols-desktop: 12;
  --grid-gap: var(--space-6);
}
```

### Bento Grid

Weather data displayed in a "bento box" layout:

```
Desktop (12 cols):
┌─────────────────┬─────────┬─────────┐
│                 │         │         │
│   Temperature   │  Wind   │  UV     │
│   (4 cols)      │ (2 cols)│(2 cols) │
│                 │         │         │
├─────────┬───────┼─────────┴─────────┤
│         │       │                   │
│ Humidity│Precip │   Temperature     │
│ (2 cols)│(2 cols)│   Graph (4 cols) │
│         │       │                   │
├─────────┴───────┼─────────┬─────────┤
│                 │         │         │
│  Sunrise/Sunset │ Pressure│ Clouds  │
│   (4 cols)      │ (2 cols)│(2 cols) │
│                 │         │         │
└─────────────────┴─────────┴─────────┘

Mobile (4 cols):
┌───────────────────┐
│   Temperature     │
│   (4 cols)        │
├─────────┬─────────┤
│  Wind   │   UV    │
│ (2 cols)│(2 cols) │
├─────────┴─────────┤
│  Temperature      │
│  Graph (4 cols)   │
├─────────┬─────────┤
│ Humidity│ Precip  │
└─────────┴─────────┘
```

---

## Components

### Button Variants

#### Primary Button
```css
.btn-primary {
  background: var(--text-primary);
  color: var(--bg-body);
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--accent);
  color: white;
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  /* ... same padding/text styles */
}

.btn-ghost:hover {
  border-color: var(--text-primary);
}
```

#### Magnetic Button (Interactive)
Buttons that "attract" to cursor before click:
- Cursor within 100px: button starts moving toward cursor
- Max displacement: 15px
- Elastic snap-back on mouse leave

### Card Variants

#### Glassmorphic Card
```css
.card-glass {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--space-4);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.05);
}
```

#### Weather Card
```css
.card-weather {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  padding: var(--space-8);
  min-height: 220px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-weather:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Watermark icon */
.card-weather .watermark {
  position: absolute;
  bottom: -20px;
  right: -10px;
  font-size: 140px;
  opacity: 0.05;
  transition: all 0.5s ease;
}

.card-weather:hover .watermark {
  color: var(--accent);
  opacity: 0.1;
  transform: scale(1.1) rotate(-10deg);
}
```

### Input Components

#### Search Input
```css
.input-search {
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--border-default);
  padding: var(--space-4) 0;
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  transition: border-color 0.3s ease;
}

.input-search:focus {
  outline: none;
  border-color: var(--accent);
}

.input-search::placeholder {
  color: var(--text-muted);
}
```

#### Checkbox Ticket
```css
.checkbox-ticket {
  display: inline-flex;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-default);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.checkbox-ticket:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.checkbox-ticket.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
  transform: translateY(-1px);
}

/* Hidden but accessible checkbox */
.checkbox-ticket input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

---

## Effects & Treatments

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .glass {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}
```

### Text Outline

```css
.text-outline {
  -webkit-text-stroke: 2px var(--text-secondary);
  color: transparent;
}

[data-theme="dark"] .text-outline {
  -webkit-text-stroke-color: rgba(255, 255, 255, 0.2);
}
```

### Parallax Depth

Cards have 3 depth layers that move at different speeds:

| Layer | Speed | Contains |
|-------|-------|----------|
| Background | 0.5x | Watermark icon |
| Content | 1x | Labels, values |
| Accent | 1.5x | Icon overlays |

### Glow Effects

```css
.glow-accent {
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.glow-sun {
  box-shadow: 0 0 60px rgba(255, 200, 50, 0.4);
}

.glow-moon {
  box-shadow: 0 0 40px rgba(200, 200, 255, 0.3);
}
```

### Noise Texture

Subtle film grain overlay for depth:

```css
.noise::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
}
```

---

## Iconography

### Icon System

Using **Lucide Vue** for consistent, tree-shakeable icons.

### Weather Icons Mapping

| Condition | Icon | Color |
|-----------|------|-------|
| Clear Day | `Sun` | --temp-warm |
| Clear Night | `Moon` | --text-secondary |
| Cloudy | `Cloud` | --text-secondary |
| Partly Cloudy | `CloudSun` | --text-secondary |
| Rain | `CloudRain` | --rain-color |
| Heavy Rain | `CloudRainWind` | --rain-color |
| Storm | `CloudLightning` | --lightning-color |
| Snow | `Snowflake` | --snow-color |
| Fog | `CloudFog` | --text-muted |
| Wind | `Wind` | --text-secondary |

### Icon Sizes

```css
:root {
  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-md: 24px;
  --icon-lg: 32px;
  --icon-xl: 48px;
  --icon-2xl: 64px;
  --icon-hero: 128px;
}
```

### Watermark Icons

Large, faded icons used as card backgrounds:
- Size: 140px
- Opacity: 5% (light), 10% (dark)
- Position: bottom-right, offset outside card bounds

---

## Responsive Design

### Breakpoints

```css
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

### Mobile-First Approach

All styles written mobile-first, then enhanced for larger screens:

```css
/* Mobile (default) */
.hero-temp {
  font-size: var(--text-6xl);
}

/* Tablet and up */
@media (min-width: 768px) {
  .hero-temp {
    font-size: var(--text-8xl);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .hero-temp {
    font-size: var(--text-9xl);
  }
}
```

### Touch Targets

All interactive elements have minimum 44x44px touch targets on mobile:

```css
@media (max-width: 768px) {
  .btn, .checkbox-ticket, .icon-btn {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Safe Areas

Account for device notches and home indicators:

```css
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  padding-top: env(safe-area-inset-top);
}
```

---

## Z-Index Scale

```css
:root {
  --z-below: -1;
  --z-base: 0;
  --z-above: 1;
  --z-header: 10;
  --z-dropdown: 20;
  --z-drawer: 30;
  --z-modal: 40;
  --z-toast: 50;
  --z-splash: 100;
}
```

---

## Shadow System

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  
  /* Colored shadows for glow effects */
  --shadow-accent: 0 10px 40px rgba(220, 38, 38, 0.3);
}
```

---

## Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

---

*Design System Version: 2.0.0*
*Last Updated: 2025-01-04*
