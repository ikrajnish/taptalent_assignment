import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Wind, Gauge, Eye, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store'; 
import { fetchForecastByCity, fetchWeatherByCity } from '../features/weather/weatherSlice';
import ForecastChart from '../components/details/ForecastChart';
import UnitToggle from '../components/common/UnitToggle';
import { convertTemp } from '../utils/unitConversion';

const CityDetails: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [chartType, setChartType] = React.useState<'temp' | 'wind' | 'humidity' | 'rain'>('temp');
  const [range, setRange] = React.useState<'24h' | '5d'>('24h');
  
  const forecast = useSelector((state: RootState) => state.weather.forecasts[cityId || '']);
  const currentWeather = useSelector((state: RootState) => state.weather.currentWeather[cityId || '']);
  const loading = useSelector((state: RootState) => state.weather.loading);
  const unit = useSelector((state: RootState) => state.settings.unit);

  useEffect(() => {
    if (cityId) {
        if (!currentWeather) dispatch(fetchWeatherByCity(cityId));
        if (!forecast) dispatch(fetchForecastByCity(cityId));
    }
  }, [cityId, dispatch, currentWeather, forecast]);

  if (loading && !currentWeather) return <div className="p-10 text-white">Loading...</div>;
  if (!currentWeather) return <div className="p-10 text-white">City not found</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </Link>
        <UnitToggle />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
            <h1 className="text-4xl font-bold text-white">{currentWeather.name}</h1>
            <p className="text-2xl text-slate-300 capitalize">{currentWeather.weather[0].description}</p>
        </div>
        <div className="text-right">
             <h2 className="text-6xl font-bold text-white">{convertTemp(currentWeather.main.temp, unit)}°</h2>
             <p className="text-slate-400">High: {convertTemp(currentWeather.main.temp_max, unit)}° Low: {convertTemp(currentWeather.main.temp_min, unit)}°</p>
        </div>
      </div>
      
      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
            { label: 'Humidity', value: `${currentWeather.main.humidity}%`, icon: Droplets },
            { label: 'Wind', value: `${currentWeather.wind.speed.toFixed(1)} m/s`, icon: Wind },
            { label: 'Pressure', value: `${currentWeather.main.pressure} hPa`, icon: Gauge },
            { label: 'UV Index', value: `${currentWeather.uv}`, icon: Sun },
            { label: 'Visibility', value: `${(currentWeather.visibility / 1000).toFixed(1)} km`, icon: Eye },
            { label: 'Dew Point', value: `${convertTemp(currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5), unit)}°`, icon: Droplets },
        ].map((stat, i) => (
            <div key={i} className="bg-glass border border-glassBorder p-4 rounded-xl flex items-center gap-3">
                <stat.icon className="text-blue-400" size={24} />
                <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-glass border border-glassBorder p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-white">Forecast</h2>
                
                <div className="flex gap-4 flex-wrap justify-end">
                     {/* Range Toggle */}
                    <div className="flex bg-white/10 rounded-lg p-1 gap-1">
                         {['24h', '5d'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r as any)}
                                className={`px-2 py-1 md:px-3 rounded-md text-xs md:text-sm capitalize transition ${range === r ? 'bg-white text-blue-900 font-bold' : 'text-slate-300 hover:text-white'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Type Toggle */}
                    <div className="flex bg-white/10 rounded-lg p-1 gap-1 overflow-x-auto max-w-full">
                        {['temp', 'wind', 'humidity', 'rain'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setChartType(type as any)}
                                className={`px-2 py-1 md:px-3 rounded-md text-xs md:text-sm capitalize transition ${chartType === type ? 'bg-white text-blue-900 font-bold' : 'text-slate-300 hover:text-white'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-80 w-full">
                {forecast ? 
                    <ForecastChart 
                        data={range === '24h' ? forecast.list.slice(0, 8) : forecast.list} 
                        type={chartType} 
                        unit={unit} 
                    /> 
                    : <p className="text-slate-400">Loading forecast...</p>
                }
            </div>
        </div>

        {/* 5-Day List */}
        <div className="bg-glass border border-glassBorder p-6 rounded-2xl backdrop-blur-md h-full">
            <h2 className="text-xl font-semibold mb-4 text-white">5-Day Forecast</h2>
            <div className="space-y-4">
                {forecast && forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map((item: any, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-700 pb-2 last:border-0">
                        <span className="text-slate-300 w-16">{new Date(item.dt * 1000).toLocaleDateString([], {weekday: 'short'})}</span>
                         <img 
                            src={item.weather[0].icon.startsWith('//') ? `https:${item.weather[0].icon}` : `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                            alt="icon" 
                            className="w-10 h-10" 
                        />
                        <span className="text-white font-bold">{convertTemp(item.main.temp, unit)}°</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
