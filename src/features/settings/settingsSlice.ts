import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  unit: 'metric' | 'imperial'; // Celsius | Fahrenheit
  theme: 'dark' | 'light';
}

const loadSettings = (): SettingsState => {
    const saved = localStorage.getItem('weather_settings');
    return saved ? JSON.parse(saved) : { unit: 'metric', theme: 'dark' };
}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('weather_settings', JSON.stringify(state));
    },
    setTheme: (state, action: PayloadAction<'dark'|'light'>) => {
        state.theme = action.payload;
        localStorage.setItem('weather_settings', JSON.stringify(state));
    }
  },
});

export const { toggleUnit, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
