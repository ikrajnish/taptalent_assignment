import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface City {
  id: number;
  name: string;
  country: string;
}

interface FavoritesState {
  items: City[];
}

// Load from local storage
const loadFavorites = (): City[] => {
  const saved = localStorage.getItem('weather_favorites');
  return saved ? JSON.parse(saved) : [];
};

const initialState: FavoritesState = {
  items: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<City>) => {
      // Check if already favorite
      if (!state.items.find(c => c.name === action.payload.name)) {
        state.items.push(action.payload);
        localStorage.setItem('weather_favorites', JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      // Assuming ID is used for removal, but we might check name primarily for API consistency
      state.items = state.items.filter(c => c.id !== action.payload);
      localStorage.setItem('weather_favorites', JSON.stringify(state.items));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
