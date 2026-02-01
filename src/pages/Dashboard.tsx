import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchWeatherByCity } from '../features/weather/weatherSlice';
import SearchBar from '../components/dashboard/SearchBar';
import WeatherCard from '../components/dashboard/WeatherCard';
import { addFavorite, removeFavorite } from '../features/favorites/favoritesSlice';
import UnitToggle from '../components/common/UnitToggle';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weatherData = useSelector((state: RootState) => state.weather.currentWeather);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const loading = useSelector((state: RootState) => state.weather.loading);
  const error = useSelector((state: RootState) => state.weather.error);
  const unit = useSelector((state: RootState) => state.settings.unit);

  const handleCitySelect = (city: string) => {
    dispatch(fetchWeatherByCity(city));
  };

  const handleToggleFavorite = (cityData: any) => {
      const isFav = favorites.find(f => f.name === cityData.name);
      if (isFav) {
          dispatch(removeFavorite(isFav.id));
      } else {
          dispatch(addFavorite({ id: cityData.id, name: cityData.name, country: cityData.sys.country }));
      }
  };

  // Combine search results (currentWeather) with Favorites data if needed
  // For this dashboard, we show what is in "currentWeather" state.
  // Initially we should load data for all favorites.
  useEffect(() => {
    favorites.forEach(fav => {
        if (!weatherData[fav.name]) {
            dispatch(fetchWeatherByCity(fav.name));
        }
    });
  }, [favorites, dispatch]);

  const cities = Object.values(weatherData);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <header className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-4xl font-bold text-white mb-2">Weather Dashboard</h1>
                <p className="text-slate-400">Track weather across the globe</p>
            </div>
            <div className="flex items-center gap-4">
                <UnitToggle />
                <SearchBar onSelectCity={handleCitySelect} />
            </div>
        </div>
      </header>
      
      {loading && <p className="text-slate-400 animate-pulse">Updating weather data...</p>}
      {error && <p className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cities.map((cityData) => (
             <WeatherCard 
                key={cityData.id} 
                data={cityData} 
                unit={unit}
                isFavorite={!!favorites.find(f => f.name === cityData.name)}
                onToggleFavorite={() => handleToggleFavorite(cityData)}
             />
        ))}
      </div>
      
      {cities.length === 0 && !loading && (
        <div className="text-center text-slate-500 mt-20">
            <p className="text-xl">Search for a city to get started</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
