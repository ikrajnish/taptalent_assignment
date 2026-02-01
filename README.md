# 🌦️ Weather Analytics Dashboard

## 1️⃣ Project Overview
The **Weather Analytics Dashboard** is a responsive, feature-rich frontend application designed to allow users to track real-time weather conditions across the globe. Built with a focus on data visualization and user experience, the dashboard provides accurate current weather, comprehensive forecasts, and analytical insights into temperature trends and precipitation probabilities.

**Problem Statement:** Users need a centralized, intuitive interface to monitor weather for multiple locations, analyze trends via charts, and customize their viewing preferences (units, favorites).

**Key Capabilities:**
- Real-time weather monitoring for any city.
- Interactive analytics (Temperature, Wind, Rain probability charts).
- Persistent user preferences (Favorites, Unit settings).
- Premium "Glassmorphism" UI with dark mode aesthetics.

---

## 2️⃣ Features

### 🖥️ Dashboard (Home Screen)
- **Multi-City Summary**: View quick-glance cards for multiple cities simultaneously.
- **Real-Time Data**: Cards display current temperature, weather condition (icon), wind speed, and humidity.
- **Navigation**: Click any card to access detailed analytics.

### 🔍 Detailed City View
- **Forecasts**: Access a 5-day daily forecast and detailed 24-hour trends.
- **Advanced Stats**: Deep dive into specific metrics including:
  - **UV Index** ☀️
  - **Dew Point** 💧
  - **Visibility** 👁️
  - **Pressure** ⏲️
  - **Feels Like** 🌡️

### 💬 Search & Favorites
- **Smart Search**: API-backed autocomplete helps users find cities instantly.
- **Favorites System**: Pin cities to the dashboard. Favorites persist across browser sessions using LocalStorage.

### ⚙️ Settings
- **Unit Toggle**: Global switch between Celsius (°C) and Fahrenheit (°F). All data and charts update instantly.

### 📊 Data Visualization
- **Interactive Charts**: Visualize trends for **Temperature**, **Wind Speed**, **Humidity**, and **Chance of Rain**.
- **Range Controls**: Switch charts between **24-Hour** and **5-Day** views.

---

## 3️⃣ Tech Stack

- **Framework**: [React](https://react.dev/) (Functional Components + Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism + Dark Theme)
- **Visualization**: [Recharts](https://recharts.org/)
- **API**: [WeatherAPI.com](https://www.weatherapi.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 4️⃣ Application Architecture

The application follows a scalable, modular architecture:

### Component Structure
- **Pages**: Top-level views (`Dashboard`, `CityDetails`).
- **Features**: structured by domain logic (e.g., `features/weather`, `features/favorites`).
- **Components**: Reusable UI blocks (`WeatherCard`, `ForecastChart`, `SearchBar`).

### Redux State Management
The store is composed of three primary slices:
1.  **Weather Slice**: Manages async data fetching (`createAsyncThunk`), normalization of weather data by city, and loading/error states.
2.  **Favorites Slice**: Manages the list of tracked cities. Syncs with LocalStorage middleware.
3.  **Settings Slice**: Toggles UI controls like `unit` (metric/imperial).

### Data Flow
1.  **User Action** (Search/Load) → **Dispatch Thunk**
2.  **Service Layer** (`weatherApi.ts`) → Calls **WeatherAPI**
3.  **Reducer** → Updates Store
4.  **UI Components** → Re-render with new data (Selectors)

---

## 5️⃣ Data Visualization

We utilize **Recharts** for performant, responsive rendering:

- **Chart Types**:
    - **Area Chart**: For Temperature trends (visualizes highs/lows with gradients).
    - **Line/Bar Representations**: For Wind and Rain probability.
- **Interactivity**:
    - **Custom Tooltips**: Show precise values on hover.
    - **Dynamic Axis**: Scales automatically based on the data range.
    - **Responsive Container**: Charts resize fluidly on mobile/desktop.

---

## 6️⃣ API Integration

**Provider**: [WeatherAPI.com](https://www.weatherapi.com/)

**Endpoints Used**:
- `/forecast.json`: fetches current weather, forecast days, and hourly data in a single call.
- `/search.json`: provides autocomplete suggestions for city names.

**Handling Strategies**:
- **Abstraction**: All API logic is encapsulated in `src/services/weatherApi.ts`.
- **Adaptation**: Response data is mapped to a consistent internal schema, allowing for easy provider swapping if needed.
- **Error Handling**: Graceful degradation with UI feedback for invalid cities or network errors.

---

## 7️⃣ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps
1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd taptalent
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`

> **Note**: A demo API key is included in the source code for reviewer convenience. For production, create a `.env` file:
> `VITE_WEATHER_API_KEY=your_key_here`

---

## 8️⃣ Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Shared items (UnitToggle)
│   ├── dashboard/       # Dashboard-specific (WeatherCard, SearchBar)
│   └── details/         # Details view (ForecastChart)
├── features/            # Redux Slices
│   ├── favorites/
│   ├── settings/
│   └── weather/
├── pages/               # Route Components (Dashboard, CityDetails)
├── services/            # API Interaction Layers
├── store/               # Redux Store Configuration
├── utils/               # Helpers (unitConversion)
├── App.tsx              # Root Component & Routing
└── main.tsx             # Entry Point
```

---

## 9️⃣ Screenshots

**(Placeholder for Project Screenshots)**

| Dashboard | City Details |
| :---: | :---: |
| *[Add Dashboard Screenshot]* | *[Add Details Screenshot]* |

| Mobile View | Search |
| :---: | :---: |
| *[Add Mobile Screenshot]* | *[Add Search Screenshot]* |

---

## 🔟 Assignment Requirement Mapping

| Requirement | Implementation Details | Location |
| :--- | :--- | :--- |
| **Dashboard (Home)** | `Dashboard.tsx` displays grid of `WeatherCard` components. | `src/pages/Dashboard.tsx` |
| **Real-time Data** | `weatherSlice` fetches live data via `weatherApi.ts`. | `src/features/weather/` |
| **Detailed View** | Dedicated route (`/city/:id`) with comprehensive stats. | `src/pages/CityDetails.tsx` |
| **Forecasts** | 5-day list and 24h charts provided. | `CityDetails.tsx` |
| **Search** | Autocomplete search with debounce. | `src/components/dashboard/SearchBar.tsx` |
| **Favorites** | Redux state persisted to `localStorage`. | `src/features/favorites` |
| **Charts** | Recharts implementation for Temp/Wind/Rain. | `src/components/details/ForecastChart.tsx` |
| **Unit Toggle** | Global Redux state toggles °C/°F across app. | `src/components/common/UnitToggle.tsx` |
| **Tech Stack** | React, Redux Toolkit, WeatherAPI. | `package.json` |

---

## 1️⃣1️⃣ Challenges & Solutions

**1. API Response Structure Differences**
*Challenge*: Switching from OpenWeatherMap to WeatherAPI meant different data shapes.
*Solution*: Implemented a **Adapter Pattern** in `weatherApi.ts` to map incoming WeatherAPI responses to our standardized internal schema, preventing UI breakage.

**2. Glassmorphism on Dark Backgrounds**
*Challenge*: Ensuring legibility while maintaining the frosted glass effect.
*Solution*: Used specific Tailwind utility combinations (`backdrop-blur`, `bg-white/10`) and strictly enforced high-contrast text colors (`text-white`, `text-slate-300`) in `index.css`.

**3. Chart Responsiveness**
*Challenge*: Charts looking cramped on mobile.
*Solution*: Wrapped charts in `ResponsiveContainer` and adjusted axis ticks/fonts dynamically via CSS and Recharts props.

---

## 1️⃣2️⃣ Future Enhancements

- 🔔 **Weather Alerts**: Push notifications for severe weather warnings.
- 🗺️ **Map Visualization**: Interactive map layer showing weather radar.
- 📉 **Historical Data**: Compare current weather with previous years.
- 📍 **Geolocation**: Auto-detect user's current city on load.

---

## 1️⃣3️⃣ Conclusion

This project demonstrates a comprehensive mastery of modern Frontend development. By combining **React** for UI, **Redux Toolkit** for complex state management, and **Data Visualization** libraries, it delivers a production-grade user experience. The scalable architecture ensures it is ready for future feature expansion.

---
*Built by [Your Name] for Frontend Evaluation*
