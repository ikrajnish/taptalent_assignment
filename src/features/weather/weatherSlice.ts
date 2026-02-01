import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../services/weatherApi';

// Define types for Weather Data (simplified for now)
export interface WeatherData {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  main: { 
      temp: number; 
      humidity: number; 
      pressure: number; 
      sea_level: number; 
      grnd_level: number;
      temp_min: number;
      temp_max: number;
      feels_like: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number; deg: number };
  visibility: number;
  uv: number;
  dt: number; // Timestamp
}

export interface ForecastData {
    list: any[]; // refined later
    city: any;
}

interface WeatherState {
  currentWeather: Record<string, WeatherData>; // Map cityId -> data
  forecasts: Record<string, ForecastData>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: {},
  forecasts: {},
  loading: false,
  error: null,
};



// Async thunk implementations
export const fetchWeatherByCity = createAsyncThunk(
    'weather/fetchByCity',
    async (city: string) => {
        const response = await weatherApi.getCurrentWeather(city);
        return response;
    }
);

export const fetchForecastByCity = createAsyncThunk(
  'weather/fetchForecastByCity',
  async (city: string) => {
      const response = await weatherApi.getForecast(city);
      return response;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload is valid (has id)
        if (action.payload && action.payload.id) {
             state.currentWeather[action.payload.name] = action.payload; // Using name as key for simple routing consistency, ideally ID
             // Or better: update by ID, but routing uses name in my example. 
             // Let's stick to name for the URL parameter consistency for now.
        }
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather';
      })
      .addCase(fetchForecastByCity.pending, (state) => {
          state.loading = true;
      })
      .addCase(fetchForecastByCity.fulfilled, (state, action) => {
          state.loading = false;
          // Store forecast by city name or ID. 
          // The API returns city info in action.payload.city
          if (action.payload && action.payload.city) {
              state.forecasts[action.payload.city.name] = action.payload;
          }
      })
      .addCase(fetchForecastByCity.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch forecast';
      });
  },
});

export default weatherSlice.reducer;
