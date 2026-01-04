# WeatherVue 2.0

## Project Overview
WeatherVue 2.0 is an award-winning, modern web application that visualizes real-time weather data with an "Atmospheric Brutalism" design philosophy. It combines editorial typography with organic, living weather effects using WebGL.

**Key Technologies:**
-   **Framework:** Vue 3 (Composition API)
-   **Language:** TypeScript (Strict)
-   **Build Tool:** Vite
-   **State Management:** Pinia
-   **Styling:** Tailwind CSS + CSS Variables
-   **Visualization:** Three.js (WebGL), D3.js (Charts), GSAP (Animations)
-   **APIs:** Open-Meteo (Weather/Geocoding), Azure Translator

## Architecture
The application follows a modular, feature-based architecture.

### Key Directories
-   `src/components/`: UI components organized by domain (`weather`, `layout`, `ui`, `canvas`).
-   `src/stores/`: Pinia stores for global state (`weatherStore`, `locationStore`, `settingsStore`).
-   `src/composables/`: Reusable Vue logic hooks (e.g., `useWeather`, `useTheme`).
-   `src/services/`: API integration layers (`weatherApi`, `geocodingApi`).
-   `src/styles/`: Global styles, Tailwind imports, and animation definitions.

### State Management (Pinia)
-   **weatherStore:** Manages current conditions, forecasts, caching, and timeline interpolation.
-   **locationStore:** Handles city search, geolocation, and user favorites.
-   **settingsStore:** Manages user preferences (theme, units, accessibility).

## Development Workflow

### Prerequisites
-   Node.js & npm/pnpm/yarn
-   Azure Translator API Key (optional, for translation features)

### Setup
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Environment:**
    -   Copy `.env.example` to `.env` (if available) or set `VITE_AZURE_API_KEY` and `VITE_AZURE_REGION` for translation support.

### Common Commands
-   **Start Development Server:**
    ```bash
    npm run dev
    ```
-   **Build for Production:**
    ```bash
    npm run build
    ```
    *Runs type checking (`vue-tsc`) and then builds via Vite.*
-   **Preview Production Build:**
    ```bash
    npm run preview
    ```
-   **Lint Code:**
    ```bash
    npm run lint
    ```
-   **Format Code:**
    ```bash
    npm run format
    ```

## Development Conventions
-   **Components:** Use `<script setup lang="ts">`.
-   **Props:** Define interface `Props` with required/optional fields.
-   **Styling:** Utility-first (Tailwind) augmented by CSS variables for theming.
-   **Performance:** Heavy components (Three.js, D3) should be lazy-loaded using `defineAsyncComponent`.
-   **Icons:** Use `lucide-vue-next`.
