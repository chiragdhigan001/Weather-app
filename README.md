# Smart Weather - 3D Weather App

A React weather app with 3D UI, weather-based particle animations, and a glassmorphism design.

## Features

- **3D Perspective UI** — content tilts with mouse movement
- **Weather Particle Effects** — sun rays, rain, snow, clouds, fog, thunderstorm animations on canvas
- **Geolocation Auto-Detect** — automatically fetches weather for your location
- **5-Day Forecast** — with min/max temperature bars and daily summaries
- **Hourly Forecast** — scrollable 24-hour forecast strip
- **Air Quality Index (AQI)** — PM2.5, PM10, O₃ levels with color-coded indicator
- **Weather Alerts** — dynamic warnings for extreme heat, cold, storms, wind, fog, heavy rain
- **Feels Like Temperature** — perceived temperature display
- **Wind Direction** — animated compass arrow with cardinal direction label
- **Sunrise/Sunset Times**
- **Atmospheric Pressure**
- **Recent Searches** — last 5 cities saved to localStorage
- **Dark/Light Mode**
- **°C / °F Toggle**
- **Glassmorphism Design** — frosted glass cards with backdrop blur
- **Animated Backgrounds** — weather-adaptive gradient backgrounds
- **Responsive** — optimized for desktop and mobile

## Tech Stack

- React 19
- Vite
- JavaScript (JSX)
- Canvas API (particle effects)
- OpenWeatherMap API

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## API

Uses OpenWeatherMap free tier. API key is bundled in `src/api/weather.js`.
